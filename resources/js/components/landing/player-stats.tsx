import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Medal, TrendingUp } from 'lucide-react';
import { Link } from '@inertiajs/react';
import PatternedShadow from '@/components/patterned-shadow';

export function PlayerStats() {
    // This would be replaced with actual data from your backend
    const players = [
        {
            id: 1,
            rank: 1,
            name: 'John Doe',
            wins: 42,
            losses: 8,
            matches: 50,
            winRate: '84%',
            trend: '+3',
            rating: 'A+'
        },
        {
            id: 2,
            rank: 2,
            name: 'Sarah Smith',
            wins: 38,
            losses: 7,
            matches: 45,
            winRate: '84.4%',
            trend: '+1',
            rating: 'A+'
        },
        {
            id: 3,
            rank: 3,
            name: 'Mike Johnson',
            wins: 35,
            losses: 10,
            matches: 45,
            winRate: '77.8%',
            trend: '-1',
            rating: 'A'
        },
        {
            id: 4,
            rank: 4,
            name: 'Emma Davis',
            wins: 32,
            losses: 8,
            matches: 40,
            winRate: '80%',
            trend: '+2',
            rating: 'A'
        },
        {
            id: 5,
            rank: 5,
            name: 'Alex Wilson',
            wins: 30,
            losses: 10,
            matches: 40,
            winRate: '75%',
            trend: '0',
            rating: 'A-'
        },
    ];

    return (
        <div className="bg-muted/50 py-24 sm:py-32">
            <div className="mx-auto max-w-[90rem] px-6 lg:px-8"> {/* Increased max-width */}
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Player Rankings
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Top performers in our badminton community
                    </p>
                </motion.div>

                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <PatternedShadow>
                        <Card className="border-primary border-2 bg-background">
                            <CardContent className="p-0">
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/50 text-xs uppercase">
                                            <tr>
                                                <th className="px-6 py-4 whitespace-nowrap">Rank</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Player</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Rating</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Matches</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Win/Loss</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Win Rate</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {players.map((player) => (
                                                <tr
                                                    key={player.id}
                                                    className="bg-card hover:bg-muted/50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {player.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                                                            {player.rank === 2 && <Medal className="h-4 w-4 text-gray-400" />}
                                                            {player.rank === 3 && <Medal className="h-4 w-4 text-amber-700" />}
                                                            <span className="font-medium">#{player.rank}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{player.name}</td>
                                                    <td className="px-6 py-4">{player.rating}</td>
                                                    <td className="px-6 py-4">{player.matches}</td>
                                                    <td className="px-6 py-4">
                                                        {player.wins}/{player.losses}
                                                    </td>
                                                    <td className="px-6 py-4">{player.winRate}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={
                                                            player.trend.startsWith('+')
                                                                ? 'text-green-500'
                                                                : player.trend.startsWith('-')
                                                                    ? 'text-red-500'
                                                                    : 'text-muted-foreground'
                                                        }>
                                                            {player.trend}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </PatternedShadow>
                </motion.div>

                <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button asChild variant="outline" className="group">
                        <Link href="/rankings">
                            View Full Rankings
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
