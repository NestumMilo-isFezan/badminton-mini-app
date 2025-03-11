import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import PatternedShadow from '@/components/patterned-shadow';

export function MatchSchedule() {
    // This would be replaced with actual data from your backend
    const liveMatches = [
        {
            id: 1,
            players: 'John vs Mike',
            venue: 'Sports Center A',
            court: 'Court 1',
            time: '14:00',
            date: 'Today',
            score: '21-19, 15-12'
        },
        {
            id: 2,
            players: 'Sarah vs Emma',
            venue: 'Sports Center B',
            court: 'Court 3',
            time: '15:30',
            date: 'Today',
            score: '21-18, 19-21, 11-8'
        },
    ];

    const upcomingMatches = [
        {
            id: 3,
            players: 'Alex vs David',
            venue: 'Sports Center A',
            court: 'Court 2',
            time: '16:00',
            date: 'Today'
        },
        {
            id: 4,
            players: 'Lisa vs Maria',
            venue: 'Sports Center C',
            court: 'Court 1',
            time: '17:30',
            date: 'Today'
        },
    ];

    return (
        <div className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Match Schedule
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Stay updated with live and upcoming matches across all venues
                    </p>
                </motion.div>

                <div className="mx-auto mt-16 grid max-w-2xl gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {/* Live Matches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <PatternedShadow>
                            <Card className="h-full border-primary border-2 bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="animate-pulse text-red-500">🔴</span>
                                        Live Matches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    {liveMatches.map((match) => (
                                        <div
                                            key={match.id}
                                            className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="font-semibold">🏸 {match.players}</h3>
                                                <span className="text-sm font-medium text-primary">
                                                    {match.score}
                                                </span>
                                            </div>
                                            <div className="grid gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{match.venue} - {match.court}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{match.time} - {match.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </PatternedShadow>
                    </motion.div>

                    {/* Upcoming Matches */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <PatternedShadow>
                            <Card className="h-full border-primary border-2 bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        ⌛ Upcoming Matches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    {upcomingMatches.map((match) => (
                                        <div
                                            key={match.id}
                                            className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <h3 className="mb-2 font-semibold">🏸 {match.players}</h3>
                                            <div className="grid gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{match.venue} - {match.court}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{match.time} - {match.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </PatternedShadow>
                    </motion.div>
                </div>

                {/* View All Button */}
                <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Button asChild variant="outline" className="group">
                        <Link href="/matches">
                            View All Matches
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
