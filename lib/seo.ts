import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import type { ComponentProps } from 'react';

export function useSeoProps(
	props: Partial<ComponentProps<typeof NextSeo>> = {},
): Partial<ComponentProps<typeof NextSeo>> {
	const router = useRouter();

	const title = 'WillyJL ─ Developer';
	const description = "Hey 👋 I'm WillyJL, a developer";

	return {
		title,
		description,
		canonical: `https://willyjl.dev${router.asPath}`,
		openGraph: {
			title,
			description,
			site_name: 'WillyJL',
			url: `https://willyjl.dev${router.asPath}`,
			type: 'website',
			images: [
				{
					url: 'https://willyjl.dev/banner.png',
					alt: description,
					width: 1280,
					height: 720,
				},
			],
		},
		twitter: {
			cardType: 'summary_large_image',
			handle: '@WillyJL_',
			site: '@WillyJL_',
		},
		...props,
	};
}
