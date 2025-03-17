import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Trophy, Medal, Users, MapPin, Gamepad2, Clock, Activity, CheckCircle2, User } from "lucide-react";
import PatternedShadow from "@/components/patterned-shadow";

interface DashboardProps {
    stats: {
        users: {
            total: number;
            by_role: {
                player: number;
                umpire: number;
            };
            verified: number;
        };
        venues: {
            total: number;
            courts_count: number;
            venues_with_courts: number;
        };
        games: {
            total: number;
            by_status: {
                pending: number;
                in_progress: number;
                completed: number;
            };
            by_type: {
                single: number;
                double: number;
            };
        };
    };
    matches: {
        upcoming: Array<{
            id: number;
            name: string;
            venue: { name: string; address: { city: string } };
            court: { name: string };
            player1: { user: { first_name: string; last_name: string } };
            player2: { user: { first_name: string; last_name: string } };
            start_time: string;
        }>;
        live: Array<{
            id: number;
            name: string;
            venue: { name: string; address: { city: string } };
            court: { name: string };
            player1: { user: { first_name: string; last_name: string } };
            player2: { user: { first_name: string; last_name: string } };
            gameScores: Array<{ player_1_score: number; player_2_score: number }>;
        }>;
        past: Array<{
            id: number;
            name: string;
            venue: { name: string; address: { city: string } };
            court: { name: string };
            player1: { user: { first_name: string; last_name: string } };
            player2: { user: { first_name: string; last_name: string } };
            winner: { user: { first_name: string; last_name: string } };
            gameScores: Array<{ player_1_score: number; player_2_score: number }>;
        }>;
    };
    topPlayers: Array<{
        id: number;
        name: string;
        avatar: string | null;
        matches: number;
        wins: number;
        losses: number;
        win_rate: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard({ stats, matches, topPlayers }: DashboardProps) {
    const [activeTab, setActiveTab] = useState('matches');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Stats Overview */}
                <div className="grid md:gap-6 md:grid-cols-3">
                    {/* Users Stats Card */}
                    <PatternedShadow size="small">
                        <Card className="relative overflow-hidden h-full border border-primary">
                            <div className="absolute right-2 top-2 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-100">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-semibold">{stats.users.total}</p>
                                    <p className="ml-2 text-sm text-gray-500">registered users</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 border-primary">
                                    <div>
                                        <p className="text-sm text-gray-500">Roles</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Players: {stats.users.by_role.player}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Umpires: {stats.users.by_role.umpire}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                <span className="text-sm">{stats.users.verified} verified</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                                                <span className="text-sm">{stats.users.total - stats.users.verified} pending</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </PatternedShadow>

                    {/* Venues Stats Card */}
                    <PatternedShadow size="small">
                        <Card className="relative overflow-hidden h-full border border-primary">
                            <div className="absolute right-2 top-2 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-100">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Venues</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-semibold">{stats.venues.venues_with_courts}</p>
                                    <p className="ml-2 text-sm text-gray-500">of {stats.venues.total} venues</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 border-primary">
                                    <div>
                                        <p className="text-sm text-gray-500">Courts</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Total: {stats.venues.courts_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Active: {stats.venues.venues_with_courts}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Metrics</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Activity className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-sm">
                                                    {(stats.venues.courts_count / stats.venues.venues_with_courts).toFixed(1)} courts/venue
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-green-500" />
                                                <span className="text-sm">{stats.venues.total} total venues</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </PatternedShadow>

                    {/* Games Stats Card */}
                    <PatternedShadow size="small">
                        <Card className="relative overflow-hidden h-full border border-primary">
                            <div className="absolute right-2 top-2 rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900 dark:text-purple-100">
                                <Gamepad2 className="h-5 w-5" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Games</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-semibold">{stats.games.total}</p>
                                    <p className="ml-2 text-sm text-gray-500">matches played</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 border-primary">
                                    <div>
                                        <p className="text-sm text-gray-500">Match Types</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Singles: {stats.games.by_type.single}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">Doubles: {stats.games.by_type.double}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                                                <span className="text-sm">{stats.games.by_status.pending}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Activity className="h-3.5 w-3.5 text-green-500" />
                                                <span className="text-sm">{stats.games.by_status.in_progress}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </PatternedShadow>
                </div>

                {/* Matches and Players Tabs */}
                <PatternedShadow size="small">
                    <Card className="border border-primary pt-0">
                        <Tabs defaultValue="matches" className="w-full">
                            <div className="border-b px-6 py-4 border-primary">
                                <TabsList className="w-full justify-start gap-6 border-0 bg-transparent p-0">
                                    <TabsTrigger
                                        value="matches"
                                        className="border-b-2 border-transparent px-0 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        Matches
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="players"
                                        className="border-b-2 border-transparent px-0 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        Top Players
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Matches Content */}
                            <TabsContent value="matches" className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Upcoming Matches Column */}
                                        <div className="flex flex-col h-full rounded-lg border-2 border-primary bg-card">
                                            <div className="flex items-center justify-between p-4 border-b border-primary">
                                                <h3 className="font-semibold text-lg">Upcoming Matches</h3>
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {matches.upcoming.length}
                                                </span>
                                            </div>

                                            <div className="p-4 h-full space-y-4 overflow-auto">
                                                {matches.upcoming.length > 0 ? (
                                                    matches.upcoming.map((match) => (
                                                        <Card key={match.id} className="border border-primary hover:border-primary transition-colors">
                                                            <CardHeader className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <CardTitle className="text-base font-medium">{match.name}</CardTitle>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                                                    <div className="text-sm font-medium truncate">
                                                                        {match.player1.user.first_name} {match.player1.user.last_name}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-muted-foreground">VS</span>
                                                                    <div className="text-sm font-medium truncate text-right">
                                                                        {match.player2.user.first_name} {match.player2.user.last_name}
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="border-t pt-3">
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>{match.venue.name} • Court {match.court.name}</span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <Card className="border-dashed border-2 border-primary">
                                                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                                            <Clock className="h-12 w-12 text-primary/50 mb-3" />
                                                            <p className="text-sm font-medium text-muted-foreground">No upcoming matches scheduled</p>
                                                            <p className="text-xs text-muted-foreground mt-1">New matches will appear here</p>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        </div>

                                        {/* Live Matches Column */}
                                        <div className="flex flex-col h-full rounded-lg border-2 border-primary bg-card">
                                            <div className="flex items-center justify-between p-4 border-b border-primary">
                                                <h3 className="font-semibold text-lg">Live Matches</h3>
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                                    <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                    {matches.live.length} Live
                                                </span>
                                            </div>

                                            <div className="p-4 h-full space-y-4 overflow-auto">
                                                {matches.live.length > 0 ? (
                                                    matches.live.map((match) => (
                                                        <Card key={match.id} className="border border-primary hover:border-primary transition-colors">
                                                            <div className="h-1 w-full bg-primary rounded-t-xl" />
                                                            <CardHeader className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <CardTitle className="text-base font-medium">{match.name}</CardTitle>
                                                                    <span className="text-xs text-primary">In Progress</span>
                                                                </div>
                                                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                                                    <div className="text-sm font-medium truncate">
                                                                        {match.player1.user.first_name} {match.player1.user.last_name}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-muted-foreground">VS</span>
                                                                    <div className="text-sm font-medium truncate text-right">
                                                                        {match.player2.user.first_name} {match.player2.user.last_name}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center gap-2">
                                                                    {match.gameScores.map((score, index) => (
                                                                        <div key={index} className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1">
                                                                            <span className="font-semibold">{score.player_1_score}</span>
                                                                            <span className="text-muted-foreground">-</span>
                                                                            <span className="font-semibold">{score.player_2_score}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="border-t pt-3">
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>{match.venue.name} • Court {match.court.name}</span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <Card className="border-dashed border-2 border-primary">
                                                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                                            <Activity className="h-12 w-12 text-primary/50 mb-3" />
                                                            <p className="text-sm font-medium text-muted-foreground">No matches in progress</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Live matches will be shown here</p>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        </div>

                                        {/* Past Matches Column */}
                                        <div className="flex flex-col h-full rounded-lg border-2 border-primary bg-card">
                                            <div className="flex items-center justify-between p-4 border-b border-primary">
                                                <h3 className="font-semibold text-lg">Past Matches</h3>
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    {matches.past.length}
                                                </span>
                                            </div>

                                            <div className="p-4 h-full space-y-4 overflow-auto">
                                                {matches.past.length > 0 ? (
                                                    matches.past.map((match) => (
                                                        <Card key={match.id} className="border border-primary hover:border-primary transition-colors">
                                                            <CardHeader className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <CardTitle className="text-base font-medium">{match.name}</CardTitle>
                                                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                                                </div>
                                                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                                                    <div className={`text-sm font-medium truncate ${match.winner.user.first_name === match.player1.user.first_name ? 'text-yellow-500' : ''}`}>
                                                                        {match.player1.user.first_name} {match.player1.user.last_name}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-muted-foreground">VS</span>
                                                                    <div className={`text-sm font-medium truncate text-right ${match.winner.user.first_name === match.player2.user.first_name ? 'text-yellow-500' : ''}`}>
                                                                        {match.player2.user.first_name} {match.player2.user.last_name}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center gap-2">
                                                                    {match.gameScores.map((score, index) => (
                                                                        <div key={index} className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1">
                                                                            <span className="font-semibold">{score.player_1_score}</span>
                                                                            <span className="text-muted-foreground">-</span>
                                                                            <span className="font-semibold">{score.player_2_score}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="border-t pt-3">
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>{match.venue.name} • Court {match.court.name}</span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <Card className="border-dashed border-2 border-primary">
                                                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                                            <Trophy className="h-12 w-12 text-primary/50 mb-3" />
                                                            <p className="text-sm font-medium text-muted-foreground">No completed matches</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Completed matches will appear here</p>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Players Content */}
                            <TabsContent value="players" className="p-6">
                                <div className="rounded-xl border border-primary overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-primary hover:bg-primary border-none">
                                                <TableHead className="text-primary-foreground font-medium first:rounded-tl-xl w-14">Rank</TableHead>
                                                <TableHead className="text-primary-foreground font-medium">Player</TableHead>
                                                <TableHead className="text-primary-foreground font-medium text-right">Matches</TableHead>
                                                <TableHead className="text-primary-foreground font-medium text-right">Wins</TableHead>
                                                <TableHead className="text-primary-foreground font-medium text-right">Losses</TableHead>
                                                <TableHead className="text-primary-foreground font-medium last:rounded-tr-xl text-right">Win Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {topPlayers.map((player, index) => (
                                                <TableRow key={player.id} className="hover:bg-primary/5 border-primary">
                                                    <TableCell className="font-medium w-14">
                                                        <div className="flex items-center justify-center">
                                                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                                                            {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                                                            {index === 2 && <Trophy className="h-5 w-5 text-amber-700" />}
                                                            {index > 2 && <span className="text-sm font-medium">#{index + 1}</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            {player.avatar ? (
                                                                <img
                                                                    src={player.avatar}
                                                                    alt={player.name}
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-primary" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium">{player.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{player.matches}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-green-600 dark:text-green-400 font-medium">{player.wins}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-red-600 dark:text-red-400 font-medium">{player.losses}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        <span className="inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-sm">
                                                            {Number(player.win_rate).toFixed(1)}%
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </PatternedShadow>
            </div>
        </AppLayout>
    );
}
