import { Icon } from '@iconify/react';
import { Layout } from '~/layouts';
import { Button } from '~/components';
import { NavigationItemType } from '~/types';

interface ErrorPageProps {
    code?: string;
    title?: string;
    message?: string;
    icon?: string;
}

export function ErrorPage({ code, title, message, icon = 'feather:alert-circle' }: ErrorPageProps) {
    return (
        <Layout.Default backgroundBlur={4} seo={{ title: 'WillyJL ─ Whoops!' }}>
            <div className="relative h-screen flex flex-grow min-h-full pt-16 pb-12">
                <div className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-shrink-0 flex justify-center">
                        <Icon
                            className="h-12 text-primary-500 w-auto"
                            icon={icon}
                        />
                    </div>
                    <div className="py-4 text-center">
                        <h1 className="mt-2 text-4xl font-extrabold text-gray-500 dark:text-white tracking-tight sm:text-5xl">
                            {code
                                ? <>{code}</>
                                : <>{title}</>
                            }
                        </h1>
                        <h3 className="mt-4 text-xl font-medium text-gray-400 dark:text-gray-400">
                            {code
                                ? <>{title}.<br />{message}</>
                                : <>{message}</>
                            }
                        </h3>
                        <div className="mt-6 flex justify-center items-center space-x-4">
                            <Button.Outline
                                icon="feather:arrow-left"
                                onClick={() => history.go(-1)}
                                type={NavigationItemType.ACTION}
                            >
                                Back
                            </Button.Outline>
                            <Button.Outline
                                icon="feather:home"
                                href="/"
                                type={NavigationItemType.LINK}
                            >
                                Home
                            </Button.Outline>
                        </div>
                    </div>
                </div>
            </div>
        </Layout.Default>
    );
}
