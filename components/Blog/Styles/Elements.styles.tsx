export function ElementsStyles() {
	return (
		<style>
			{`
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					@apply text-gray-700 dark:text-gray-100;

					a {
						@apply float-left mt-0.5 -ml-5 pr-2 border-none opacity-0 no-underline;

						.icon-link:before {
							content: '#';
						}
					}

					&:hover,
					&:focus {
						a {
							@apply opacity-100 no-underline;
						}
					}
				}

				a {
					@apply dark:text-white no-underline rounded transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2;

					.item {
						@apply border-b-0 opacity-60 no-underline transition duration-300 ease-in-out;

						&:hover {
							@apply opacity-100;
						}
					}
				}

				p,
				ul,
				li {
					@apply text-gray-500 dark:text-gray-300;
				}

				strong {
					@apply text-gray-700 dark:text-gray-100;
				}

				img {
					@apply rounded-3xl object-cover select-none hover:shadow-xl transition ease-in-out duration-300;
				}

				figcaption {
					@apply text-gray-200 dark:text-gray-300 text-center;
				}

				hr {
					@apply my-4 dark:border-gray-600;
				}

				code {
					@apply bg-gray-100 dark:bg-gray-700 p-1 text-gray-500 dark:text-gray-300 rounded;

					&:after,
					&:before {
						@apply hidden;
					}
				}

				pre {
					@apply bg-gray-200 dark:bg-gray-800 m-0 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg rounded-t-none;
				}

				th {
					@apply dark:text-white;
				}

				td {
					@apply text-gray-500 dark:text-gray-300;
				}

				ol li::before {
					@apply text-gray-500 dark:text-gray-300;
				}

				.remark-code-title {
					@apply light:bg-white px-4 py-2 text-gray-600 dark:text-gray-200 font-medium border-2 border-b-0 border-gray-200 dark:border-gray-600 rounded-lg rounded-b-none;
				}
			`}
		</style>
	);
}
