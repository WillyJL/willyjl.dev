---
tagline: NAT My Beloved
title: "LocalSend through 2 layers of NAT"
description: Routing LocalSend multicast traffic via Qubes OS's 2 layer NAT network stack
banner: /images/localsend-through-2-layers-of-nat.png
banner_alt: LocalSend and Qubes OS logos next to each other with a plus sign in between.
date: '2024-08-18'
---

<br />
<br />

# :sparkles: The Goal

**[LocalSend](https://localsend.org/)** is an app that allows **quick sharing of files and media between devices on the same network**. It is available for virtually any platform you would want to use it on, and it's **Free and Open Source Software**. I found it particularly useful because iPhones still include a very outdated USB 2 port which means extremely slow transfer speeds via cable, while with a WiFi connection I could get **several orders of magnitude better upload times** between devices. And thanks to LocalSend, I can do that without needing to setup some SFTP or SMB share, **making quick spontaneous transfers a breeze**.

Before going forward, we need to understand how LocalSend works its magic. You can find an in-depth explanation in the [LocalSend protocol](https://github.com/localsend/protocol) repository, but the short of it is as follows:
- When a member becomes available, it **announces with a UDP multicast packet to `224.0.0.167` port `53317`**
- Other members will notice this and reply by either:
  - Contacting the new member's **API directly on TCP port `53317`**
  - As a fallback, sending their own UDP multicast to `224.0.0.167` port `53317`
- After discovery, **further interaction happens directly** peer-to-peer using the HTTP REST API **on TCP port `53317`**

This means that **both devices must be able to send and receive both multicast UDP and regular TCP on port `53317`**.

<br />
<br />

# :no_entry: The Problem

[Qubes OS](https://www.qubes-os.org/) features a pretty interesting network stack ([documentation](https://www.qubes-os.org/doc/networking/), [old blog post](https://theinvisiblethings.blogspot.com/2011/09/playing-with-qubes-networking-for-fun.html)), which however requires us to do some manual work before LocalSend will work properly. By default, Qubes OS has:
- a `sys-net` VM which has **access to your network hardware** directly
- a `sys-firewall` VM which **handles most of the traffic routing** between VMs
- the AppVMs **which you interact with** and use daily

For security reasons, this is not done by bridging the interfaces, but by **NATting (Network Address Translation) the traffic at each gateway hop**. This is a clever and scalable design, which however means that **our `localsend` VM is stranded far away from our home network, behind 2 walls of NAT**.

![Qubes OS network stack diagram. Image by Invisible Things Lab.](/images/localsend-through-2-layers-of-nat/qubes-default-net-config.png)

From normal AppVMs we can already reach other devices on the network, this is just normal day-to-day usage, so no problems here: outgoing TCP is already solved. **What we need to figure out is**:
- Routing **incoming TCP and UDP** traffic from `sys-net` through `sys-firewall` and **to our `localsend` VM**
- Forwarding **outgoing UDP multicasts** from `localsend` through `sys-firewall` and **to `sys-net`'s hardware network interface**

> Note: The next 3 sections explain what needs to happen and show example commands, but are not enough for a permanent setup. Don't start running them yet, there is a complete example at the end.

<br />
<br />

# :calling: Incoming TCP and UDP

This usecase is actually fairly common: it is equivalent to exposing a service running on your PC to the outer internet, AKA **port forwarding**. Essentially, we need to configure the outer-bound node of our network to **accept traffic on a certain port and forward it to where the service is actually running**. Just like you might've forwarded some port from your home router to your PC so that a local webserver (or Minecraft gameserver) is accessible from the internet, here instead we need to forward from `sys-net` to `sys-firewall` and then to our `localsend` VM.

Being a relatively common usecase, **Qubes OS has [documentation](https://www.qubes-os.org/doc/firewall/#port-forwarding-to-a-qube-from-the-outside-world) on how to do this**, we just need to change the parameters to match ones used by LocalSend.

> Note: Qubes OS Docs mention using `ip saddr 192.168.x.y/24` to limit which IP addresses can reach the service. To avoid having to update the rules every time I connect to another network, I decided to leave this parameter out.

In `sys-net`:
```bash:Forward from sys-net to sys-firewall
port=53317  # Default LocalSend port
iface=wls6f0  # Network interface connected to outside world
firewall=10.x.y.z  # Internal IP of sys-firewall

# Prerouting chain to apply DNAT (Destination NAT)
nft add chain qubes custom-dnat-localsend \
    '{ type nat hook prerouting priority filter +1; policy accept; }'

# We need both TCP and UDP traffic
for proto in tcp udp; do

    nft add rule qubes custom-dnat-localsend \
        iif == $iface $proto dport $port \  # Match
        ct state new,established,related counter \  # Boilerplate
        dnat $firewall  # DNAT to sys-firewall

    nft add rule qubes custom-forward \
        iif == $iface ip daddr $firewall $proto dport $port \  # Match
        ct state new,established,related counter \  # Boilerplate
        accept  # Accept the forwarded packets

done
```

In `sys-firewall`, we need to do mostly the same, but to `localsend` VM instead of `sys-firewall`:
```bash:Forward from sys-firewall to localsend VM
port=53317  # Default LocalSend port
iface=eth0  # Network interface connected to sys-net
localsend=10.a.b.c  # Internal IP of localsend VM

# Prerouting chain to apply DNAT (Destination NAT)
nft add chain qubes custom-dnat-localsend \
    '{ type nat hook prerouting priority filter +1; policy accept; }'

# We need both TCP and UDP traffic
for proto in tcp udp; do

    nft add rule qubes custom-dnat-localsend \
        iif == $iface $proto dport $port \  # Match
        ct state new,established,related counter \  # Boilerplate
        dnat $localsend  # DNAT to localsend VM

    nft add rule qubes custom-forward \
        iif == $iface ip daddr $localsend $proto dport $port \  # Match
        ct state new,established,related counter \  # Boilerplate
        accept  # Accept the forwarded packets

done
```

In `localsend`, we don't need to forward any further, just accept:
```bash:Accept traffic in localsend VM
port=53317  # Default LocalSend port
iface=eth0  # Network interface connected to sys-firewall
localsend=10.a.b.c  # Internal IP of localsend VM

# We need both TCP and UDP traffic
for proto in tcp udp; do

    # Accept the packets that we are receiving
    nft add rule qubes custom-input \
        iif == $iface $proto dport $port ip daddr $localsend \  # Match
        ct state new,established,related counter \  # Boilerplate
        accept  # Accept the received packets

done
```

This was the easy part, and gets us to being **discoverable and reachable by other LocalSend members**. Now it becomes a bit more tricky, as discovering other members on th network requires more work.

<br />
<br />

# :satellite_antenna: Outgoing UDP Multicasts

This situation is instead less common to encounter, in fact there is **no documentation for it on Qubes OS**. Since multicast doesn't have a single recipient address, this is not as simple as allowing the traffic through.

What helped me greatly is realizing, after more Googling that I'd like to admit, that **LocalSend's discovery is actually very similar to Chrome Cast**. [This gist](https://gist.github.com/squarooticus/7b8c6cc5871213db6baa12eb3c01f036) showing how to repeat Chrome Cast mDNS/Bonjour packets across 2 network interfaces got me very close to having a working LocalSend setup.

When our `localsend` VM sends a multicast packet, it reaches a virtual network interface `vif*.*` in `sys-firewall`, which acts like a router and tries to notify the clients connected to it of the multicast packet. What we want to happen instead is forwarding (or due to how nftables work, duplicating) this packet to the upstream network interface before it gets processed and broadcasted on this VM's network.

Taking inspiration from the core idea of that gist, I came up with this for `sys-firewall`:
```bash:Duplicate multicast from sys-firewall to sys-net
port=53317  # Default LocalSend port
iface=eth0  # Network interface connected to sys-net
multicast=224.0.0.167  # Default LocalSend multicast IP

# There's no custom-prerouting by default, have to setup manually
nft add chain qubes custom-prerouting
nft insert rule qubes prerouting jump custom-prerouting

# Repeat multicasts before they're broadcasted
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \  # Match
    ip ttl set 2 \  # Needs to live through the interface hop
    dup to $multicast device $iface notrack  # Duplicate outbound
```

And for `sys-net` we do mostly the same, but also update the source IP address so that other LocalSend members know how to reach us:
```bash:Duplicate multicast from sys-net to outside world
port=53317  # Default LocalSend port
iface=wls6f0  # Network interface connected to outside world
multicast=224.0.0.167  # Default LocalSend multicast IP
localip=192.168.x.y  # Local IP address on LAN

# There's no custom-prerouting by default, have to setup manually
nft add chain qubes custom-prerouting
nft insert rule qubes prerouting jump custom-prerouting

# Repeat multicasts before they're broadcasted
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \  # Match
    ip ttl set 2 \  # Needs to live through the interface hop
    ip saddr set $localip \  # Set which IP we can be reached from
    dup to $multicast device $iface notrack  # Duplicate outbound
```

**At this point, LocalSend would work fine, we can discover other devices and they can discover us**. What bothered me was the **hardcoded local IP address**: ideally I would have liked it to work on any network I connect to.

<br />
<br />

# :label: Kinda Automatic SNAT

I spent a full day trying every possible combination of nftables chains, tables, families, rules, priorities... **nothing worked to automatically set the source IP**. It really threw me off, because there is a **statement that would be perfect for this usecase: `masquerade`**, which updates the source IP address with the one of the network interface it is leaving through. The problem is that **`masquerade` can only be used in `postrouting` chains of type `nat`, but the UDP multicasts from LocalSend never show in `nat postrouting` chains**. I could trace them just fine in `filter output`, `nat output` and `filter postrouting` chains, but *never* in a `nat postrouting` chain. It seems like [I'm not alone either](https://www.google.com/search?q=packet+skips+nat+postrouting) (exhibit [A](https://superuser.com/questions/1784372/forwarded-packet-seemingly-skipping-postrouting-rules), [B](https://superuser.com/questions/1194351/iptables-nat-postrouting-table-skipped-altogether), [C](https://serverfault.com/questions/807304/packets-not-hitting-postrouting-rule-leaving-interface-unedited), [D](https://unix.stackexchange.com/questions/673287/masquerade-doesnt-work-the-response-packets-are-lost), [E](https://forum.mikrotik.com/viewtopic.php?t=68691), [F](https://netfilter.vger.kernel.narkive.com/xj6TIo9U/packets-not-hitting-the-nat-postrouting-table)), but nothing I tried seemed to fix it. And it's even weirder because the default Qubes OS setup includes a `masquerade` at the end of `postrouting` chain, so *anything* that leaves through the outbound network interface should be SNATted (Source NAT), but these multicast packets simply ignore it.

In the end I gave up on trying to automatically set the source IP address with nftables, and instead **looked for *good enough* workarounds**. Turns out, `sys-net` uses **NetworkManager**, which has a handy `dispatcher` drop-in system that allows us to register a script to run when the outbound local IP changes. So the new plan is:
- have a new nftables `custom-snat-localsend` chain which contains a single rule that updates the source IP address (this makes it easy to replace it with scripts)
- multicast packets jump to `custom-snat-localsend` before being duplicated
- the NetworkManager dispatcher script updates the `custom-snat-localsend` chain with correct IP when it changes, or a `drop` rule if we aren't connected

```bash:Duplicate multicast from sys-net to outside world and SNAT automatically
port=53317  # Default LocalSend port
iface=wls6f0  # Network interface connected to outside world
multicast=224.0.0.167  # Default LocalSend multicast IP

# There's no custom-prerouting by default, have to setup manually
nft add chain qubes custom-prerouting
nft insert rule qubes prerouting jump custom-prerouting

# Simple chain to manually SNAT (Source NAT) in prerouting
nft add chain qubes custom-snat-localsend

# Jump to apply manual SNAT
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \  # Match
    jump custom-snat-localsend  # Set which IP we can be reached from

# Repeat multicasts before they're broadcasted
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \  # Match
    ip ttl set 2 \  # Needs to live through the interface hop
    dup to $multicast device $iface notrack  # Duplicate outbound
```

<br />

```bash:/etc/NetworkManager/dispatcher.d/custom-hook-localsend
#!/usr/bin/sh
set -e

if [ "$2" = up -o "$2" = dhcp4-change ]; then
    ip=$(ip -o -4 addr list "$1" | awk '{print $4}' | cut -d/ -f1)
    nft flush chain qubes custom-snat-localsend
    nft add rule qubes custom-snat-localsend ip saddr set $ip
fi
if [ "$2" = down ]; then
    nft flush chain qubes custom-snat-localsend
    nft add rule qubes custom-snat-localsend drop
fi
```

With this, **LocalSend will work perfectly with no intervention required after setting up**.

<br />
<br />

# :floppy_disk: Permanent Setup

Thus far, I only included example commands with some explanation of what they do and why. **Since `sys-net` and `sys-firewall` are AppVMs, changes to the root partition are lost after a reboot, so we need to do our configuration in the `/rw/` partition**. Furthermore, in Qubes OS 4.2.2 **`sys-firewall` is fully disposable, so we need to put the configuration in the disposable template**.

In my case, `sys-net` is an AppVM and `sys-firewall` is a DisposableVM based on `default-dvm`, so any configuration in `sys-firewall` will instead happen in `default-dvm`, but for the sake of clarity I will note what VM we are configuring for, not necessarily where it should actually go. **Just make sure you check how your system is set up and put the configuration in the correct place**. Also, I decided to include commands that reset the configuration beforehand, so I can simply re-run the script to re-apply it.

For `sys-net` there's the most configuration:

```bash:sys-net: /rw/config/qubes-firewall-user-script
# Reset custom firewall state
if ! nft flush chain qubes custom-prerouting 2> /dev/null; then
    # There's no custom-prerouting by default, have to setup manually
    nft add chain qubes custom-prerouting
    nft insert rule qubes prerouting jump custom-prerouting
fi
for chain in custom-prerouting custom-forward; do
    nft flush chain qubes $chain
done

port=53317  # Default LocalSend port
iface=wls6f0  # Network interface connected to outside world
firewall=10.x.y.z  # Internal IP of sys-firewall
multicast=224.0.0.167  # Default LocalSend multicast IP

# Incoming TCP and UDP with DNAT
nft delete chain qubes custom-dnat-localsend 2> /dev/null || true
nft add chain qubes custom-dnat-localsend \
    '{ type nat hook prerouting priority filter +1; policy accept; }'
for proto in tcp udp; do
    nft add rule qubes custom-dnat-localsend \
        iif == $iface $proto dport $port \
        ct state new,established,related counter \
        dnat $firewall  # DNAT to sys-firewall
    nft add rule qubes custom-forward \
        iif == $iface ip daddr $firewall $proto dport $port \
        ct state new,established,related counter \
        accept  # Accept the forwarded packets
done

# Outgoing UDP multicast with SNAT
nft delete chain qubes custom-snat-localsend 2> /dev/null || true
nft add chain qubes custom-snat-localsend
nft add rule qubes custom-snat-localsend \
    drop  # Drop by default until script sets LAN IP
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \
    jump custom-snat-localsend  # Set which IP we can be reached from
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \
    ip ttl set 2 \
    dup to $multicast device $iface notrack  # Duplicate outbound
cp /rw/config/custom-hook-localsend /etc/NetworkManager/dispatcher.d/
```

<br />

```bash:sys-net: /rw/config/custom-hook-localsend
#!/usr/bin/sh
set -e

if [ "$2" = up -o "$2" = dhcp4-change ]; then
    ip=$(ip -o -4 addr list "$1" | awk '{print $4}' | cut -d/ -f1)
    nft flush chain qubes custom-snat-localsend
    nft add rule qubes custom-snat-localsend ip saddr set $ip
fi
if [ "$2" = down ]; then
    nft flush chain qubes custom-snat-localsend
    nft add rule qubes custom-snat-localsend drop
fi
```

In `sys-firewall` we forward to localsend VM instead, and we don't need to worry about SNAT:

```bash:sys-firewall: /rw/config/qubes-firewall-user-script
# Reset custom firewall state
if ! nft flush chain qubes custom-prerouting 2> /dev/null; then
    # There's no custom-prerouting by default, have to setup manually
    nft add chain qubes custom-prerouting
    nft insert rule qubes prerouting jump custom-prerouting
fi
for chain in custom-prerouting custom-forward; do
    nft flush chain qubes $chain
done

port=53317  # Default LocalSend port
iface=eth0  # Network interface connected to sys-net
localsend=10.a.b.c  # Internal IP of localsend VM
multicast=224.0.0.167  # Default LocalSend multicast IP

# Incoming TCP and UDP with DNAT
nft delete chain qubes custom-dnat-localsend 2> /dev/null || true
nft add chain qubes custom-dnat-localsend \
    '{ type nat hook prerouting priority filter +1; policy accept; }'
for proto in tcp udp; do
    nft add rule qubes custom-dnat-localsend \
        iif == $iface $proto dport $port \
        ct state new,established,related counter \
        dnat $localsend  # DNAT to localsend VM
    nft add rule qubes custom-forward \
        iif == $iface ip daddr $localsend $proto dport $port \
        ct state new,established,related counter \
        accept  # Accept the forwarded packets
done

# Outgoing UDP multicast
nft add rule qubes custom-prerouting \
    iif != $iface udp dport $port ip daddr $multicast \
    ip ttl set 2 \
    dup to $multicast device $iface notrack  # Duplicate outbound
```

And finally in `localsend` we just accept the traffic, but in rc.local since it's not a NetVM:
```bash:localsend: /rw/config/rc.local
# Reset custom firewall state
for chain in custom-input; do
    nft flush chain qubes $chain
done

port=53317  # Default LocalSend port
iface=eth0  # Network interface connected to sys-firewall
localsend=10.a.b.c  # Internal IP of localsend VM

# Incoming TCP and UDP
for proto in tcp udp; do
    nft add rule qubes custom-input \
        iif == $iface $proto dport $port ip daddr $localsend \
        ct state new,established,related counter \
        accept  # Accept the received packets
done
```

**That's it!**

<br />
<br />

# :checkered_flag: Conclusion

While figuring this out took way longer that I would like to admit, I think it was definitely worth it. I learned so much about Qubes and networking along the way, and seeing it working perfectly in the end was amazing. I hope you learned something useful from this adventure too!
