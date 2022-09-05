import clsx from 'clsx';

import { colors } from '~/lib';

import type { WithClassName } from '~/types';
import { DISCORD_STATUS_COLOR, READABLE_DISCORD_STATUS } from '~/types';

interface IndicatorProps extends WithClassName {
	status?: string;
}


export function Indicator({ className, status = '' }: IndicatorProps) {
	const color = DISCORD_STATUS_COLOR[status];
	const pulse = status !== 'offline';
	status = READABLE_DISCORD_STATUS[status];

	return (
		<span
			className={clsx(
				'relative inline-flex justify-center items-center w-5 h-5 mr-3',
				className,
			)}
			title={status}
		>
			<span className="absolute flex h-3 w-3">
				{pulse && (
					<span
						className="absolute inline-flex w-full h-full opacity-75 rounded-full motion-safe:animate-ping"
						style={{ backgroundColor: colors?.[color]?.['400'] }}
					/>
				)}
				<span
					className="relative inline-flex w-3 h-3 rounded-full"
					style={{ backgroundColor: colors?.[color]?.['500'] }}
				/>
			</span>
		</span>
	);
}
