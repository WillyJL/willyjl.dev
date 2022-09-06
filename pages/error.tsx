import { useRouter } from 'next/router';

import { ErrorPage } from '~/components';

export default function Error() {
	const router = useRouter();
	const { status } = router.query;

	return <ErrorPage code={status?.toString()} title="Something went wrong on our end" message="This isn't your fault, it's ours. Please try again later." icon="feather:alert-octagon" />;
}
