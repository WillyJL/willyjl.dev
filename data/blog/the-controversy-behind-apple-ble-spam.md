---
tagline: Revealing the Facts
title: The controversy behind Apple BLE Spam
description: How a researcher gets recognition for other people's work and no-one cares
banner: /images/the-controversy-behind-apple-ble-spam.webp
banner_alt: Flipper Zero with pixelated neon lines radiating from it. Image by Flipper Devices.
date: '2023-09-14'
---

<br />
<br />

# :exclamation: The Lies

You might have seen the blog [post](https://techryptic.github.io/2023/09/01/Annoying-Apple-Fans/) that Techryptic made, or the news outlets [crediting him](https://techcrunch.com/2023/09/05/flipper-zero-hacking-iphone-flood-popups/) for creating an "iPhone DDoS", or [YouTube videos](https://www.youtube.com/watch?v=whhPipa6sBc) about the matter, or none of the former.

Point is that in all of these cases, Techryptic is portrayed (and portrays himself) as a ***"security researcher"*** that discovered a **serious vulnerability in iPhones** which allows just about anyone with a **Flipper Zero** to annoy people close by to the point of their **phone being unusable**.
On a [Twitter reply](https://twitter.com/tech/status/1699623483620131073?s=20) he even referred to himself as "the author" of this exploit, and that his findings were relevant because "you can continuously spam it to the point of making all surrounding devices unusable".

All of this **could not be further from the truth**, and I'm going to prove and document it here.

<br />
<br />

# :white_check_mark: The Facts

Techryptic played very little part in this whole situation, and most definitely does not deserve all the attention and praise he has received. The short of it is that **he did not discover the vulnerability, he did not write the code for it, nor did he make it flood iPhones with popups and "DDoS" them**. He made a YouTube video and a blog post claiming other's work as his own, and got recognized for it.

The actual timeline looks something more like this:

### 2019-2021: Research on Apple Continuity BLE
Groundwork on reverse engineering Apple's BLE protocol "Continuity" is laid by multiple parties, mentioned here are the ones pertaining to this situation:
- 2019-02-28: FuriousMAC, with [packet structures and Nearby Info messages](https://github.com/furiousMAC/continuity).
- 2019-05-31: Gu. Celosia and Ma. Cunche, with [Proximity Pairing messages](https://petsymposium.org/2020/files/papers/issue1/popets-2020-0003.pdf).
- 2019-07-25: Hexway, with [Apple bleee example scripts](https://github.com/hexway/apple_bleee).
- 2021-03-03: Al. Heinrich, with [Find My messages](https://arxiv.org/pdf/2103.02282.pdf).

### 2022-07-15: Haxorthematrix posts AirTag tools repo
Haxorthematrix, AKA Larry Pesce, [posts on GitHub](https://github.com/haxorthematrix/AirTag-tools) some tools to discover and create beacon packets for both registered (Find My) and unregistered (Proximity Pair) AirTags.

### 2022-11-15: Salmq posts custom adv code for Flipper
Salmq, AKA Salvador Mendoza, from Ocelot Offsec posts on Github the necessary [gap.c code edits](https://github.com/Ocelot-Offensive-Security/Arsenal/tree/main/Amini/FlipperZero) to use custom BLE advertisement packets on Flipper Zero, showing both registered (Find My) (on GitHub), and unregistered (Proximity Pair) ([on Twitter](https://twitter.com/Netxing/status/1584654410856423424)), AirTag packets.

### 2022-11-24: Techryptic showcases AirTag spoof on Flipper
Techryptic takes to [Twitter](https://twitter.com/tech/status/1595564779665498112) and [YouTube](https://www.youtube.com/watch?v=m_-nMw5bzjI) to showcase the Flipper Zero fooling iPhones into showing an AirTag setup menu, just like salmq did. He did not share the code for it at this time. Given the time frame however, it would seem logical that this was based on the work posted by salmq of Ocelot Offsec a few days prior.

### 2023-01-15: Culturally makes Flipper Zero AirTag repo
Culturally publishes [his GitHub repo](https://github.com/culturally/flipper-zero-airtag) with some instructions and premade files to use your own Airtag (registered, Find My packets) on Flipper, based on the tool scripts by haxorthematrix and the gap.c code by salmq.

### 2023-08-13: Jae Bochs spams DEFCON 31 with iOS popups
DEFCON 31 attendees notice random AppleTV and similar popups on their Apple devices, and Jae Bochs [admits to being the culprit](https://infosec.exchange/@jb0x168/110879394826675242). This was with Nearby Action packets, since some of them (in particular AppleTV ones) are longer range than Proximity Pair ones (intended to be used close to the device).

### 2023-08-24: ECTO-1A releases AppleJuice repo
After seeing the iPhone popups at DEFCON, ECTO-1A dives into the previous research by FuriousMAC and Hexway, and makes the [AppleJuice repo](https://github.com/ECTO-1A/AppleJuice) with renovated scripts, and adding more packet types (never documented before) by trial and error changing packet contents. He also wrote [a blog post about it](https://ecto-1a.github.io/AppleJuice/).

### 2023-09: Techryptic misleads everyone
- **2023-09-01**: Techryptic releases his [blog post](https://techryptic.github.io/2023/09/01/Annoying-Apple-Fans/) with the code for the videos he showed **10 months prior** on 2022-11-24.
- Unsurprisingly it is the **same exact BLE adv code made by salmq**, down to the structure, variable names, some comments and code formatting being identical character per character. (The rest of the gap.c file is the official Flipper Zero firmware [gap.c](https://github.com/flipperdevices/flipperzero-firmware/blob/dev/firmware/targets/f7/ble_glue/gap.c), the relevant lines for this "exploit" were [posted by salmq](https://github.com/Ocelot-Offensive-Security/Arsenal/tree/main/Amini/FlipperZero), in the second half of `gap_advertise_start()`). Keep in mind that **none of the code published up until now was capable of spam/flood/DDoS**, it simply emulated a single AirTag/AppleTV.
- So for 10 months Techryptic kept **someone else's public code "secret" and then re-released it as his own**, with no mention of anyone else, and taking advantage of the DEFCON news. The only new thing since "his" demo on 2022-11-24 is that he added 4 more packet types, which all came from [ECTO-1A's AppleJuice](https://github.com/ECTO-1A/AppleJuice) (proven by [Techryptic's packets](https://github.com/Techryptic/Techryptic.github.io/commit/02054ec0a4cc4411429b542794ad839aee316a6b#diff-f34a7fb61a9cc01eb48c32a902d2ef73398b12d8baccaa64ae41317c1d2304cbR77-R79) being **identical, byte for byte, to the ones shared** [by ECTO-1A](https://github.com/ECTO-1A/AppleJuice/commit/4190dfdbaaceeffb17536eec8becb46cd9cc167f#diff-007728e6aa1af8c13929b166bbdcc4649274598791f09b3466739b0f1e1a6903R35-R37), including a `0xc1` which ECTO-1A used for testing and is not found on any production devices).
- **2023-09-02**: I (WillyJL) find Techryptic's [Reddit post](https://www.reddit.com/r/flipperzero/comments/167o3nq/annoying_apple_fans_the_flipper_zero_bluetooth/) and take inspiration from that tiny bit of relevant code to make an [API that apps can use](https://github.com/Flipper-XFW/Xtreme-Firmware/commit/87124a1d2c7a4662f2b4f0002df6fffe6a5e6f12) and then [my own basic app using it](https://github.com/Flipper-XFW/Xtreme-Firmware/commit/bf41740b8ff1925da2323e030c77ef7ddb697248) as **part of Xtreme firmware** (here I credited Techryptic because back then **I had no idea it wasn't his work**).
- **2023-09-03**: I keep researching on my own, looking at [documentation by FuriousMAC](https://github.com/furiousMAC/continuity/) and brainstorming with [ECTO-1A](https://github.com/ECTO-1A/) directly. I end up understanding how the packets work, and **what data can be randomized in order to make multiple popups appear**. Then publish a [version of the app](https://github.com/Flipper-XFW/Xtreme-Firmware/commit/8444cdb3539b553ba76a11408b817b7b3b480045) that **can spam/flood/DDoS and has 30+ new packets**, with more credits for the documentation and Proximity Pairing IDs.
- **2023-09-04**: Techryptic posts a followup [video](https://www.youtube.com/watch?v=OWXt8oTJ1lo) and [tweet](https://twitter.com/tech/status/1698716127734411337) saying he "collaborated with the developer of Xtreme firmware to make this into an app" (has since been cut from the video), which is false since **the whole app was made by me** and we now know that **"his" BLE code was not made by him**, and showing my app's "DDoS" functionality, with **no credits or mention of me or Xtreme firmware**.
- **2023-09-05**: TechCrunch [writes an acticle](https://techcrunch.com/2023/09/05/flipper-zero-hacking-iphone-flood-popups/) about "Flipper Zero spamming nearby iPhones with popups", but since Techryptic made no real mention of me or Xtreme, **he gets all the "praise"**. Even though he did not find this "vulnerability", nor did he make it flood devices with popups, **the article portrays him as discovering all of this from start to finish on his own**.
- **2023-09-06**: Over those few days I kept quiet and worked on improving the app, by now it uses a **completely different [BLE adv API](https://github.com/Flipper-XFW/Xtreme-Firmware/commit/2125f1fca48575b007b047ca7275d944d7404b75) fully written by me**. I also start investigating the code used by Techryptic and come to the conclusions above: that **he wrote none of it**.
- **2023-09-07**: 0day, AKA Ryan Montgomery, [features my app in a tweet](https://twitter.com/0dayCTF/status/1699842688776900894), once again with wrong credits due to Techryptic's deception. I decide to [speak up](https://twitter.com/WillyJL_/status/1699853692881482006) and let it be known that this is not his work (here I still credited him for the AirTag code, I later found out that wasn't his either as outlined above).
- **2023-09-08**: Techryptic, perhaps after realizing that this lie has far outgrown anything that he could hide, **tries to cover his tracks**. First by [removing a line](https://github.com/Techryptic/Techryptic.github.io/commit/c99c3dfad1896a22092f1c852d70ac1b979d8761) from his blog post that encouraged authors to fact check their work, and then [renaming](https://github.com/Techryptic/Techryptic.github.io/commit/423aa87b24668f8cc4e736bb3a26120bd824a899), [deleting](https://github.com/Techryptic/Techryptic.github.io/commit/83afa557e9493eb9950d3ee511cea47353dc0b8d) and [replacing](https://github.com/Techryptic/Techryptic.github.io/commit/5cc182ce46e84f9ab4a6cb63ac9245ad7231e518) his gap.c code to **hide the previous traces of ECTO-1A's research**.
- **2023-09-10**: Mental Outlaw [releases a video](https://www.youtube.com/watch?v=whhPipa6sBc) covering this exploit, and he too credits Techryptic because of his misleading blog post and tweets. Trying to explain the situation with proper credits in the comments, **my account gets shadowbanned and my comments deleted**, as well as most others that tried to explain the situation, so the remaining comments portray me as the problematic individual stealing the work, leaving me **no way to explain myself and the horrible situation**.

<br />
<br />

# :skull: The Mockery

Perhaps Techryptic foresaw my post on the horizon and hoped to cover his credibility a tiny bit by setting some things "straight" and silencing the rest. He tried his best but failed to realize that **people remember, and Git even more so**. He:

- [mentioned me and Xtreme](https://github.com/Techryptic/Techryptic.github.io/commit/203a43c7f522cedb786bae662cd7b77748dd8917) in his post, just to [remove it merely 2 hours later](https://github.com/Techryptic/Techryptic.github.io/commit/ceac34908e284503fe1ccf7d2001564c1295dd19)
- [cut away mentions of me and Xtreme from his video, and turned off comments](https://www.youtube.com/watch?v=OWXt8oTJ1lo)
- [removed encouragement to "fact check"](https://github.com/Techryptic/Techryptic.github.io/commit/c99c3dfad1896a22092f1c852d70ac1b979d8761) from his blog post
- [replaced traces of ECTO-1A's work](https://github.com/Techryptic/Techryptic.github.io/commit/83afa557e9493eb9950d3ee511cea47353dc0b8d) with [clean packets](https://github.com/Techryptic/Techryptic.github.io/commit/5cc182ce46e84f9ab4a6cb63ac9245ad7231e518) in "his" code
- [added some "credits" in the code](https://github.com/Techryptic/Techryptic.github.io/commit/1653d6edb5be108b8119ebc8162767eb3d384294) (NOT the article) mentioning ChatGPT (lol), MidJourney (lmao), and Salmq (the actual creator, while Techryptic [pretends to have randomly come up with a 1:1 replica of salmq's code on his own](https://github.com/Techryptic/Techryptic.github.io/commit/807ae8c04ec33cf4fa53ec86d3e502a54f9c4dc4), *a couple days after* salmq posted his)
- *2 weeks after publishing the article* [added the bare minimum technical details](https://github.com/Techryptic/Techryptic.github.io/commit/9d30ba232f747f5b6b78699ac45131fef9291c34) and [code](https://github.com/Techryptic/Techryptic.github.io/commit/c51445d10cf3baa012fb0d2fd23e0bfdd8faf235) that a *"security research"* write-up like this should contain, although this is **very superficial**, was **all known and documented for 4+ years** as per the very tidy [FuriousMac continuity repo](https://github.com/furiousMAC/continuity/), and his code leaves lots to be desired (redeclared the same array 3 times with just a few bytes added each time? with `for` loops redundantly copying data 2 times?)
- but while doing so forgot to look at the [screenshots he posted](https://github.com/Techryptic/Techryptic.github.io/commit/dec22c9f14ca1c34fdc630c44d63471ac1f2db5a) that [show date Jan 15 2023](https://raw.githubusercontent.com/Techryptic/Techryptic.github.io/dec22c9f14ca1c34fdc630c44d63471ac1f2db5a/img/in-post/post-js-version/annoying-apple-fans/wireshark1.PNG), which [perfectly match the date culturally published his repo](https://github.com/culturally/flipper-zero-airtag/commit/bc5d6b05f6d4f0dbb0d85255d008260171daef82)... (so is culturally just another victim? or are Techryptic and culturally the same person? if so, why would Techryptic post on his accounts, then release the code 1 month later as culturally, then re-release the code as Techryptic 9 months after?)

**In summary** Techryptic took [salmq's BLE PoC code](https://github.com/Ocelot-Offensive-Security/Arsenal/tree/main/Amini/FlipperZero), (most likely) used [haxorthematrix's AirTag tools](https://github.com/haxorthematrix/AirTag-tools), grabbed [ECTO-1A's packet data](https://github.com/ECTO-1A/AppleJuice), released "his" sub-par and misrepresented Franken-code in a blog post with no credits, showed off [my app's dynamic and spam/flood/DDoS behavior](https://github.com/Flipper-XFW/Xtreme-Firmware/tree/dev/applications/external/apple_ble_spam) (which "his" code is not capable of), and **got labelled as the creator of all of it, not once trying to explain how the actual facts went**. And to add insult to injury, he **tried to cover up his inexcusable behaviour** after the fact multiple times.

<br />
<br />

# :scales: Justice?

The sad reality is that no-one cares. The media is too busy to do the proper background checks on what they write articles about, and the ***actual* developers** that put real effort and talent into this **don't have the time to burn on blog posts**, or the building blocks they make are not worthy of an article by themselves, and rather should be used in bigger projects ***and rightfully credited***.

All that I can hope is that this can be a cautionary tale for the few of you wonderful people reading this.

<br />
<br />

# :black_right_pointing_double_triangle_with_vertical_bar: A year later

I find it crazy to think that it has already been almost a year (well, 11 months as of writing on 2024-08-18), time really flies so fast. **A lot more has happened with this story since I wrote this blog post, most of it in the few months following it**, and I realize that it lacks a lot of details and credits of what happened after, making it quite outdated.

To start off, the app is now called **BLE Spam**, because it supports **multiple different platforms and protocols**. There were a lot **more people that contributed to the research** too:
- **Google FastPair** for **Android** was studied by [Spooks4576](https://github.com/Spooks4576), also based on its [documentation](https://developers.google.com/nearby/fast-pair/specifications/introduction), and implemented into BLE Spam by me
- **Valid FastPair codes** were scraped by [Spooks4576](https://github.com/Spooks4576), [Mr. Proxy](https://github.com/Mr-Proxy-source) and [xAstroboy](https://github.com/xAstroBoy), compiled into [BluetoothDB](https://bluetoothdb.com/) ([GitHub](https://github.com/Mr-Proxy-source/BLE-DB)), and added to BLE Spam
- **Microsoft SwiftPair** for **Windows** was studied by [Spooks4576](https://github.com/Spooks4576), also based on its [documentation](https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/bluetooth-swift-pair), and implemented into BLE Spam by me
- **Apple Continuity device colors and more device types** were discovered by [xAstroboy](https://github.com/xAstroBoy) and [Mr. Proxy](https://github.com/Mr-Proxy-source), and implemented into BLE Spam by me
- **Samsung EasySetup** (naming is not clear, this covers Samsung Buds and Watches) was reverse engineered and scraped for valid codes by [Spooks4576](https://github.com/Spooks4576), and implemented into BLE Spam by me
- **LoveSpouse adult toys** and app were researched by [mandomat](https://github.com/mandomat) on [his blog](https://mandomat.github.io/2023-11-13-denial-of-pleasure/) with a proof of concept Flipper app (no source code), then I replicated his findings and implemented them into BLE Spam
- Later on I implemented **NameFlood** (made-up name) into BLE Spam, which spams fake connectable advertisements to fill the Bluetooth devices list in devices' settings

And most notably, [ECTO-1A](https://github.com/ECTO-1A/) by pure coincidence found **a flaw in how iPhones on iOS 17 parsed certain Continuity packets, causing them to freeze completely, crash, and reboot**. This got assigned `CVE-2023-42941` and even made mainstream news ([WSMV4](https://www.wsmv.com/2023/11/29/device-brought-tennessee-high-school-shuts-off-cell-phones-other-electronics/), [ZDNet](https://www.zdnet.com/article/flipper-zero-can-lock-up-an-iphone-running-the-latest-ios-17/), [Ars Technica](https://arstechnica.com/security/2023/11/flipper-zero-gadget-that-doses-iphones-takes-once-esoteric-attacks-mainstream/), [The Verge](https://www.theverge.com/2023/11/3/23944901/apple-iphone-ios-17-flipper-zero-attack-bluetooth)) and brought a decent chunk of attention to Flipper Zero and BLE Spam. You can read more about it on [ECTO-1A's blog post](https://ecto-1a.github.io/AppleJuice_CVE/). As [confirmed by Apple](https://support.apple.com/en-us/120877), this affected only iOS 17 on iPhone XS and later, and was **fixed in iOS 17.2**.

Since then, **all the affected operating systems and vendors have added cooldowns and better sanity checks** for these BLE protocols, so **BLE Spam is now more of a fun party trick**, which is *all it was ever meant to be*. To be honest, it did get a little out of hand, especially with the iOS 17 Lockup Crash, but I'm hopeful that going forward this incident will entice software vendors to secure their protocols.

Finally, the Flipper **Xtreme firmware** under which I had developed BLE Spam **is now defunct**, I now work on my own **continuation of it called [Momentum Firmware](https://momentum-fw.dev)**, which is where I continue to **[keep BLE Spam updated](https://github.com/Next-Flip/Momentum-Apps/tree/dev/ble_spam)** as the Flipper Zero API evolves.
