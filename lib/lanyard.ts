import { useLanyard } from 'react-use-lanyard';

export function useStatus() {
	const userId = process.env.NEXT_PUBLIC_DISCORD_ID;
	return useLanyard({
		userId,
		socket: true,
	});
}
