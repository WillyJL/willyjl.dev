import { Blog } from '~/components';
import { getAllPostsFrontMatter } from '~/lib/post';
import { Layout } from '~/layouts';
import { Animate } from '~/components';
import { ErrorPage } from '~/components';

import type { GetStaticProps } from 'next';

import type { FrontMatter } from '~/types';

interface BlogProps {
	serialisedFrontmatters: string;
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
	const frontmatters = await getAllPostsFrontMatter();

	return {
		props: {
			serialisedFrontmatters: JSON.stringify(frontmatters),
		},
	};
};

export default function BlogPage({ serialisedFrontmatters }: BlogProps) {
	const frontmatters = JSON.parse(serialisedFrontmatters) as Array<FrontMatter>;

	if (frontmatters.length === 0) return <ErrorPage title="There's nothing here" message="Sorry, there are no blog posts for now. Check back later!" />;

	const latestPost = frontmatters.shift();

	return (
		<Layout.Default seo={{ title: 'WillyJL ─ Blog' }}>
			<div className="mt-8 sm:mt-16 mb-20 mx-0 sm:mx-6 lg:mb-28 lg:mx-8">
				<div className="relative max-w-6xl mx-auto">
					<Animate
						animation={{ y: [50, 0], opacity: [0, 1] }}
						key={0}
					>
						<Blog.Latest frontmatter={latestPost} />
					</Animate>
					<div className="mt-4 lg:mt-12 grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:max-w-none">
						{frontmatters.map((frontmatter, i) => (
							<Animate
								animation={{ y: [50, 0], opacity: [0, 1] }}
								key={i + 1}
								transition={{
									delay: 0.1 * (i + 1),
								}}
							>
								<Blog.Post key={i} frontmatter={frontmatter} index={i} />
							</Animate>
						))}
					</div>
				</div>
			</div>
		</Layout.Default>
	);
}
