import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import PatternedShadow from '@/components/patterned-shadow';

// Sample venue data - replace with actual data from your backend
const venues = [
    {
        id: 1,
        name: 'Sports Arena Alpha',
        location: 'Central District',
        courts: 6,
        openingHours: '7:00 AM - 11:00 PM',
        facilities: ['Shower', 'Parking', 'Pro Shop'],
        rating: 4.8,
        currentPlayers: 24,
    },
    {
        id: 2,
        name: 'Elite Badminton Center',
        location: 'West Zone',
        courts: 8,
        openingHours: '6:00 AM - 10:00 PM',
        facilities: ['Cafe', 'Parking', 'Training Programs'],
        rating: 4.6,
        currentPlayers: 16,
    }
];

export function FeaturedVenues() {
    return (
        <section className="relative bg-background py-16 sm:py-24 lg:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Featured Venues
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        Discover top-rated badminton facilities near you, complete with modern amenities and active communities
                    </p>
                </motion.div>

                <div className="mx-auto mt-12 sm:mt-16">
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-12">
                        {venues.map((venue, index) => (
                            <motion.div
                                key={venue.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group"
                            >
                                <PatternedShadow>
                                    <Card className="overflow-hidden transition-all duration-300 h-full border-primary border-2 bg-background">
                                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-[21/9] overflow-hidden">
                                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground">
                                                <span className="flex items-center gap-1">
                                                    ⭐ {venue.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <CardHeader className="p-0 pb-4">
                                                <CardTitle className="text-xl flex items-center justify-between">
                                                    {venue.name}
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                        {venue.courts} Courts
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{venue.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{venue.openingHours}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Users className="h-4 w-4" />
                                                        <span>{venue.currentPlayers} players now</span>
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {venue.facilities.map((facility) => (
                                                            <span
                                                                key={facility}
                                                                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                                            >
                                                                {facility}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
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
                        <Button asChild variant="outline" size="lg" className="group">
                            <Link href="/venues">
                                Explore All Venues
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
