import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Header() {
    const { auth } = usePage<SharedData>().props;

    return (
        <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed w-full border-b border-border/40 bg-background/80 backdrop-blur-sm z-50"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                >
                    <AppLogoIcon className="h-8 w-8" />
                    <span className="text-lg font-semibold">Badminton Match</span>
                </motion.div>
                <nav className="flex items-center gap-4">
                    {auth.user ? (
                        <Button asChild>
                            <Link href={route('dashboard')}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href={route('login')}>Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('register')}>Get Started</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </motion.header>
    );
}