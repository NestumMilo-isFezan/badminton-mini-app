import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-sidebar-foreground dark:border-r dark:border-sidebar-border lg:flex overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/split-layout-img.jpg)' }}
                />

                {/* Gradient overlay using theme colors */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, hsl(15 95% 35% / 0.95) 0%, hsl(15 95% 35% / 0.4) 65%, hsl(15 95% 35% / 0) 100%)'
                    }}
                />

                {/* Content */}
                <div className="relative z-20 flex h-full flex-col">
                    {/* Logo and App Name */}
                    <Link
                        href={route('home')}
                        className="flex items-center gap-3 text-xl font-semibold text-white"
                    >
                        <AppLogoIcon className="size-10 fill-current" />
                        <span>{name}</span>
                    </Link>

                    {/* Main Content Area */}
                    <div className="mt-auto max-w-[420px] space-y-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Welcome to the games!
                        </h1>

                        {quote && (
                            <blockquote className="space-y-3 opacity-85">
                                <p className="text-xl font-medium text-white italic">
                                    &ldquo;{quote.message}&rdquo;
                                </p>
                                <footer className="text-sm text-white/70">
                                    — {quote.author}
                                </footer>
                            </blockquote>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full bg-background lg:p-8 lg:h-full overflow-auto">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] min-h-full py-8">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-foreground sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
