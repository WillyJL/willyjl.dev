import { ErrorPage } from '~/components';

export default function Error() {
	return <ErrorPage title="Looks like you took a wrong turn" message="The page you're looking for couldn't be found." icon="feather:alert-triangle" />;
}
