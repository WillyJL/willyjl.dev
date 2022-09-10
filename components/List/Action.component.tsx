import clsx from 'clsx';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType } from 'react';

type ActionProps = {
	as?: ElementType;
} & (
		| ({
			as?: 'button';
		} & ButtonHTMLAttributes<HTMLButtonElement>)
		| ({
			as?: 'a';
		} & AnchorHTMLAttributes<HTMLAnchorElement>)
	);

export function Action({ as: Component = 'button', children, className, ...rest }: ActionProps) {
	return (
		<Component
			className={clsx(
				'relative inline-flex justify-center w-full sm:w-10 h-10 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-medium font-medium default-transition default-focus',
				className,
			)}
			{...rest}
		>
			{children}
		</Component>
	);
}
