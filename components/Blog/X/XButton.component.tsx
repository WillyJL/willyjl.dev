import { Button } from '~/components';
import { NavigationItemType } from '~/types';

import type { ButtonHTMLAttributes } from 'react';

interface XButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	external?: boolean;
	href: string;
	icon?: string;
	label: string;
	center?: boolean;
}

export function XButton({ external, href, icon, label, center = true }: XButtonProps) {
	return (
		<div className={center ? 'text-center' : ''}>
			<Button.Outline className="px-5" type={NavigationItemType.LINK} external={external} href={href} icon={icon}>
				{label}
			</Button.Outline>
		</div>
	);
}
