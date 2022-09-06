import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';

import { Navbar } from '~/components';
import { usePersistantState, useSeoProps } from '~/lib';

import type { WithChildren, WithProps } from '~/types';

const Background = dynamic(() =>
	import('~/components/Background/Standard.component').then(({ Standard }) => Standard),
);

interface DefaultLayoutProps extends WithChildren {
	background?: boolean;
	backgroundBlur?: number;
	seo?: Partial<WithProps<typeof NextSeo>>;
}

export function DefaultLayout({
	background: overrideBackground,
	backgroundBlur = 0,
	children,
	seo: customSeo,
}: DefaultLayoutProps) {
	const { animations: background } = usePersistantState().get();
	const showBackground = overrideBackground ?? background;

	const seo = useSeoProps(customSeo);

	return (
		<>
			<NextSeo {...seo} />
			<Navbar.Standard />
			<main className="flex flex-col justify-center px-8">
				{showBackground && <Background blur={backgroundBlur} />}
				{children}
			</main>
		</>
	);
}
