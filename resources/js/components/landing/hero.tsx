import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Users } from 'lucide-react';

export function Hero() {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            {/* Background Image and Gradient Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/hero-img.webp)' }}
                />

                {/* Gradient Overlay using theme colors */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(
                                circle at center,
                                hsl(15 95% 55% / 0.2) 0%,
                                hsl(15 95% 45% / 0.4) 50%,
                                hsl(15 95% 35% / 0.8) 100%
                            )
                        `
                    }}
                />
            </div>

            <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1
                        className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your Gateway to Badminton Matches with Us
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-lg leading-8 text-primary-foreground/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Join as a player to participate in matches and tournaments, or become a spectator
                        to follow live games, track rankings, and stay connected with the badminton community.
                    </motion.p>
                    <motion.div
                        className="mt-10 flex items-center justify-center gap-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            size="lg"
                            variant="secondary"
                            className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                            asChild
                        >
                            <Link href={route('register')}>
                                Register as Player
                                <UserPlus className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
