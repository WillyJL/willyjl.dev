import emojiRegex from 'emoji-regex';
import { log } from 'next-axiom';

import type { GitHubRepos, Project, ProjectPost } from '~/types';

/**
 * Fetch Projects
 *
 * Make a GET request to the GitHub API to gather all repositories
 * under my `Willy-JL` username & then filter them down to only
 * include those that contain the `portfolio` topic
 *
 * @TODO Switch to v3 API using GraphQL to save over-fetching
 */
export async function fetchProjects(): Promise<Array<Project> | null> {
	const user = 'Willy-JL';

	let repos: GitHubRepos = [];
	let page = 1;
	while (true) {
		const response = await fetch(`https://api.github.com/users/${user}/starred?per_page=100&page=${page}`, {
			headers: {
				...(process.env.GITHUB_PAT && {
					authorization: `token ${process.env.GITHUB_PAT}`,
				}),
			},
		});

		const res = await response.json();

		if (response.status !== 200) {
			const error = res as {
				documentation_url: string;
				message: string;
			};

			console.error({ error });
			log.error('Failed to fetch repos', { error });

			return null;
		}

		if (res.length === 0) break;
		repos = repos.concat(res as GitHubRepos);
		page += 1;
	}

	const { default: rawProjectPosts } = await import('~/data/projects.json');
	const projectPosts = rawProjectPosts as Array<ProjectPost>;

	const projects: Array<Project> = repos
		.sort((a, b) => b.stargazers_count - a.stargazers_count)
		.map((repo) => {
			if (!repo.permissions.push) return null;

			if (!repo.description) return null;
			const [emoji, ...desc] = repo.description.split(' ');
			const description = desc.join(' ');
			if (!emojiRegex().test(emoji)) return null;
			if (repo.owner.login === user && !repo.topics.includes('in-portfolio')) return null;

			// Check if there is a matching blog post to attach
			const repoPost =
				projectPosts.length > 0 &&
				projectPosts.find(
					(post) => post.repository.toLowerCase() === repo.full_name.toLowerCase(),
				);

			return {
				description,
				icon: emoji,
				homepage: repo.homepage ?? undefined,
				name: repo.name,
				post: repoPost ? `/blog/${repoPost.post}` : undefined,
				template: false,
				url: repo.html_url,
			} as Project;
		})
		.filter((project) => project !== null);

	return projects;
}
