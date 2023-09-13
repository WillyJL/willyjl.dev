import { fetchProjects } from '~/lib/projects';
import { Layout } from '~/layouts';
import { Animate, List } from '~/components';
import { ListActionType } from '~/types';
import { ErrorPage } from '~/components';

import type { GetStaticProps } from 'next';

import type { ListAction, Project } from '~/types';

interface ProjectProps {
	stringifiedProjects: string;
}

export const getStaticProps: GetStaticProps<ProjectProps> = async () => {
	const projects = await fetchProjects();

	return {
		props: {
			stringifiedProjects: JSON.stringify(projects),
		},
		revalidate: 3600,
	};
};

export default function ProjectsPage({ stringifiedProjects }: ProjectProps) {
	const projects = JSON.parse(stringifiedProjects) as Array<Project>;

	if (projects.length === 0) return <ErrorPage title="There's nothing here" message="Sorry, there are no projects listed for now. Check back later!" />;

	return (
		<Layout.Default seo={{ title: 'WillyJL ─ Projects' }}>
			<div className="my-24 mx-2 sm:mx-6 lg:mb-28 lg:mx-8">
				<div className="relative max-w-xl mx-auto">
					<List.Container>
						{projects.map((project, index) => (
							<Animate
								animation={{ y: [50, 0], opacity: [0, 1] }}
								key={index}
								transition={{
									delay: 0.1 * index,
								}}
							>
								<List.Item
									actions={[
										...(project.homepage
											? [
												{
													type: ListActionType.LINK,
													href: project.homepage,
													icon: 'feather:external-link',
													label: `${project.name} homepage`,
												} as ListAction,
											]
											: []),
										{
											type: ListActionType.LINK,
											href: project.url,
											icon: 'feather:github',
											label: 'GitHub Repository',
										},
									]}
									description={project.description}
									icon={<span className="text-xl">{project.icon}</span>}
									title={<span className="text-primary-400 dark:text-primary-300">{project.name}</span>}
								/>
							</Animate>
						))}
					</List.Container>
				</div>
			</div>
		</Layout.Default>
	);
}
