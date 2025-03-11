import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Medal, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import PatternedShadow from '@/components/patterned-shadow';

const features = [
    {
        name: 'Live Match Schedule',
        description: 'View upcoming matches across different venues and courts in real-time. Stay updated with the badminton community.',
        icon: Calendar,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        name: 'Venue Overview',
        description: 'Explore various badminton venues and their court availability. Find where the action is happening.',
        icon: MapPin,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
    },
    {
        name: 'Player Statistics',
        description: 'Browse through player rankings, match history, and performance metrics. See who tops the leaderboards.',
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10'
    },
    {
        name: 'Tournament Updates',
        description: 'Follow ongoing tournaments, brackets, and results. Never miss an important match.',
        icon: Medal,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
];

export function Features() {
    return (
        <section className="relative bg-muted/50 py-16 sm:py-24 lg:py-32 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Everything you need to manage matches
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        Comprehensive tools and features designed to enhance your badminton experience
                    </p>
                </motion.div>

                <div className="mx-auto mt-12 sm:mt-16">
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                whileHover="hover"
                            >
                                <PatternedShadow>
                                    <Card className="h-[280px] transition-all duration-300 border-primary border-2 bg-background group-hover:bg-primary group-active:bg-primary">
                                        <CardContent className="h-full p-6 flex flex-col">
                                            <div className="flex items-center gap-4 mb-4">
                                                <motion.div
                                                    className={`p-2.5 rounded-lg ${feature.bgColor} group-hover:bg-primary-foreground/10 group-active:bg-primary-foreground/10`}
                                                    variants={{
                                                        hover: {
                                                            y: [0, -4, 0],
                                                            transition: {
                                                                duration: 0.5,
                                                                repeat: Infinity
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <feature.icon className={`h-5 w-5 ${feature.color} group-hover:text-primary-foreground group-active:text-primary-foreground`} />
                                                </motion.div>
                                                <h3 className="font-semibold text-lg group-hover:text-primary-foreground group-hover:underline group-active:text-primary-foreground group-active:underline">
                                                    {feature.name}
                                                </h3>
                                            </div>
                                            <p className="text-muted-foreground text-sm group-hover:text-primary-foreground/80 group-active:text-primary-foreground/80">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </PatternedShadow>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button asChild variant="default" size="lg" className="group">
                            <Link href="/features">
                                Learn More About Features
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
