import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type GameScore } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle, Play, Square, RefreshCw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ServeIndicator {
    player: "A" | "B";
    position: "left" | "right";
}

interface MatchDetail {
    id?: number;
    set: number;
    player_1_score: number;
    player_2_score: number;
    status: 'not_started' | 'started' | 'completed';
    start_at: string | null;
    match_duration: number | null;
}

interface Props {
    gameScore: {
        data: GameScore;
    };
}

/* DO NOT DESTROY THIS COMMENTS
* Backend Involved :
* controller - Admin/ScoreController
* resource - GameScoreResource
* route - admin.php
* type - PaginatedData<GameScore>
*
* Scope :
* 1. Retrieve Game Match Details (Including, Match, Players, Scores and Umpire)
* 2. Display Match and Score Details
* 3. Tab 1 : View Match Scores
* 3.1 - Admin can add/decrease score between players
* 3.2 - Admin can start/stop match per set
* 3.3 - Admin can finish match, and system suggest the winner and admin can validate it
* 3.4 - The game has 3 sets, and each set has 21 points
* 3.5 - Admin can retract match score if needed
* 3.6 - Admin can add new set's after finish
* 4. Tab 2 : View Match Details
* 4.1 - Admin can view match details
* 4.2 - Admin can view match history
* 4.3 - Admin can view match statistics
*/

export default function Show({ gameScore }: Props) {
    const game = gameScore.data;
    const [currentSet, setCurrentSet] = useState<MatchDetail>(
        game.match_details[game.match_details.length - 1] as MatchDetail
    );
    const [timer, setTimer] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [serving, setServing] = useState<ServeIndicator>({
        player: "B",
        position: "right"
    });
    const [loading, setLoading] = useState<boolean>(false);

    // Add useEffect to handle timer
    useEffect(() => {
        // Clear any existing interval
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }

        // Start timer if set is started
        if (currentSet.status === 'started' && currentSet.start_at) {
            const startTime = new Date(currentSet.start_at).getTime();

            // Initial timer value
            const currentTime = new Date().getTime();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            setTimer(elapsedSeconds);

            // Start interval
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const elapsed = Math.floor((now - startTime) / 1000);
                setTimer(elapsed);
            }, 1000);

            setTimerInterval(interval);
        } else {
            setTimer(0);
        }

        // Cleanup interval on unmount or when set changes
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [currentSet.status, currentSet.start_at, currentSet.set]);

    const handleScore = async (playerId: number, action: 'increment' | 'decrement') => {
        if (currentSet.status !== 'started') {
            alert('Please start the set first');
            return;
        }

        // Update the score locally first for immediate feedback
        const newSet = { ...currentSet };
        if (playerId === game.player_1.id) {
            newSet.player_1_score += action === 'increment' ? 1 : -1;
        } else {
            newSet.player_2_score += action === 'increment' ? 1 : -1;
        }
        setCurrentSet(newSet);

        // Send request to server
        router.put(
            route('admin.score.update', {
                game: game.id,
                set: currentSet.set
            }),
            {
                player_id: playerId,
                action: action
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    // Revert the local state if the server request fails
                    setCurrentSet(currentSet);
                }
            }
        );
    };

    const startSet = () => {
        // Only determine initial server if it's the first serve of the match
        if (game.match_details.length === 1 && currentSet.set === 1) {
            determineInitialServer();
        }
        // Otherwise, keep the current serving state

        // Update local state immediately
        setCurrentSet(prev => ({
            ...prev,
            status: 'started',
            start_at: new Date().toISOString()
        }));

        router.post(route('admin.score.start-set', {
            game: game.id,
            set: currentSet.set
        }), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                // Revert the local state if the server request fails
                setCurrentSet(prev => ({
                    ...prev,
                    status: 'not_started',
                    start_at: null
                }));
            }
        });
    };

    const finishSet = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }

        // Update local state immediately for better UX
        setCurrentSet(prev => ({
            ...prev,
            status: 'completed',
            match_duration: timer
        }));

        router.post(route('admin.score.finish-set', {
            game: game.id,
            set: currentSet.set
        }), {
            match_duration: timer
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Update game.match_details to reflect the completed set
                const updatedMatchDetails = [...game.match_details];
                const setIndex = updatedMatchDetails.findIndex(s => s.set === currentSet.set);
                if (setIndex !== -1) {
                    updatedMatchDetails[setIndex] = {
                        ...updatedMatchDetails[setIndex],
                        status: 'completed',
                        match_duration: timer
                    };
                }

                // Update the game state with the new match details
                game.match_details = updatedMatchDetails;

                // If this is set 3 or if there's a clear winner, update game status
                const completedSets = updatedMatchDetails.filter(s => s.status === 'completed').length;
                const player1Wins = updatedMatchDetails.filter(s =>
                    s.status === 'completed' && s.player_1_score > s.player_2_score
                ).length;

                if (completedSets === 3 || player1Wins >= 2 || (completedSets - player1Wins) >= 2) {
                    game.status = 'completed';
                }
            },
            onError: () => {
                // Revert the local state if the server request fails
                setCurrentSet(prev => ({
                    ...prev,
                    status: 'started',
                    match_duration: null
                }));
            }
        });
    };

    const addNewSet = () => {
        if (game.match_details.length >= 3) {
            alert('Maximum 3 sets allowed');
            return;
        }

        const nextSetNumber = game.match_details.length + 1;

        router.post(route('admin.score.store', {
            game: game.id
        }), {
            set: nextSetNumber
        }, {
            onSuccess: (response) => {
                // Create a new set object
                const newSet: MatchDetail = {
                    set: nextSetNumber,
                    player_1_score: 0,
                    player_2_score: 0,
                    status: 'not_started',
                    start_at: null,
                    match_duration: null
                };

                // Switch to the new set
                setCurrentSet(newSet);
            }
        });
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleServe = () => {
        setServing(prev => ({
            player: prev.player === "A" ? "B" : "A",
            position: prev.position === "left" ? "right" : "left"
        }));
    };

    // Add this function to determine who serves first at the start of a set
    const determineInitialServer = () => {
        // In badminton, player who won last set serves first in next set
        const lastSet = game.match_details[currentSet.set - 2]; // Get previous set
        if (lastSet) {
            const winner = lastSet.player_1_score > lastSet.player_2_score ? "A" : "B";
            setServing({
                player: winner,
                position: "right" // Server always starts from right court
            });
        } else {
            // For first set, use default (Player A serves first from right court)
            setServing({
                player: "A",
                position: "right"
            });
        }
    };

    // Add function to switch between sets
    const switchSet = (set: MatchDetail) => {
        setCurrentSet(set);
        // Timer will be handled by useEffect
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Tournaments',
            href: route('admin.games.index')
        },
        {
            title: `${gameScore.data.name}`,
            href: route('admin.games.show', { game: gameScore.data.id })
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Score Management - ${game.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Match Header */}
                <Card className="bg-white border-2 border-primary px-3">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">{game.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(game.start_time), 'PPP')}
                                </p>
                            </div>
                            <Badge variant={game.status === 'pending' ? 'outline' : 'default'}>
                                {game.status.toUpperCase()}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{game.venue.name} - {game.court.name}</span>
                            </div>
                            {game.umpire.name ? (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>Umpire: {game.umpire.name}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>No umpire assigned</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Scoring Interface */}
                <Card className="bg-white pt-0 px-3 border-2 border-primary">
                    <CardHeader className="text-primary text-center pt-4">
                        <CardTitle className="text-2xl">SINGLE MATCH</CardTitle>
                        <div className="text-sm">3 Sets of 21 points</div>
                    </CardHeader>

                    <CardContent className="bg-muted border py-4 rounded-3xl">
                        {currentSet.status !== 'completed' ? (
                            // Scoring Section
                            <div className="">
                                <div className="grid grid-cols-3 gap-8">
                                    {/* Player 1 */}
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold mb-4 text-primary">{game.player_1.name}</h2>
                                        <div className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleScore(game.player_1.id, 'decrement')}
                                                className="h-20 w-10"
                                                disabled={currentSet.status !== 'started'}
                                            >
                                                <MinusCircle className="h-8 w-8" />
                                            </Button>

                                            <div className={cn(
                                                "bg-white rounded-md pt-8 flex flex-col w-full max-w-[150px] border-2",
                                                serving.player === "A" ? "border-destructive" : "border-primary"
                                            )}>
                                                <span className="text-6xl font-bold pb-4">{currentSet.player_1_score}</span>
                                                {serving.player === "A" && (
                                                    <div className="bg-destructive text-white text-xs font-semibold py-1 uppercase">
                                                        Serving {serving.position}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleScore(game.player_1.id, 'increment')}
                                                className="h-20 w-10"
                                                disabled={currentSet.status !== 'started'}
                                            >
                                                <PlusCircle className="h-8 w-8" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Center Controls */}
                                    <div className="text-center flex flex-col justify-center gap-6">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">SET {currentSet.set}</h3>
                                            <div className="text-xl font-mono">{formatTime(timer)}</div>
                                        </div>

                                        {currentSet.status === 'not_started' && (
                                            <div className="space-y-4">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={toggleServe}
                                                    className="w-full"
                                                >
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Change Server
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    onClick={startSet}
                                                    className="w-full"
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Start Set
                                                </Button>
                                            </div>
                                        )}

                                        {currentSet.status === 'started' && (
                                            <div className="space-y-4">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={toggleServe}
                                                    className="w-full"
                                                >
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Change Server
                                                </Button>

                                                <Button
                                                    size="lg"
                                                    variant="destructive"
                                                    onClick={finishSet}
                                                    disabled={loading}
                                                    className="w-full"
                                                >
                                                    <Square className="mr-2 h-4 w-4" />
                                                    Finish Set
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Player 2 */}
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold mb-4 text-primary">{game.player_2.name}</h2>
                                        <div className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleScore(game.player_2.id, 'decrement')}
                                                className="h-20 w-10"
                                                disabled={currentSet.status !== 'started'}
                                            >
                                                <MinusCircle className="h-8 w-8" />
                                            </Button>

                                            <div className={cn(
                                                "bg-white rounded-md pt-8 flex flex-col w-full max-w-[150px] border-2",
                                                serving.player === "B" ? "border-destructive" : "border-primary"
                                            )}>
                                                <span className="text-6xl font-bold pb-4">{currentSet.player_2_score}</span>
                                                {serving.player === "B" && (
                                                    <div className="bg-destructive text-white text-xs font-semibold py-1 uppercase">
                                                        Serving {serving.position}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleScore(game.player_2.id, 'increment')}
                                                className="h-20 w-10"
                                                disabled={currentSet.status !== 'started'}
                                            >
                                                <PlusCircle className="h-8 w-8" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Set Complete Section
                            <div className="">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Set {currentSet.set} Complete</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Winner: {currentSet.player_1_score > currentSet.player_2_score
                                                ? game.player_1.name
                                                : game.player_2.name
                                            }
                                        </p>
                                        {game.match_details.length < 3 && (
                                            <Button
                                                onClick={addNewSet}
                                                disabled={loading}
                                                className="w-full"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Set {game.match_details.length + 1}
                                            </Button>
                                        )}
                                        {game.match_details.length >= 3 && (
                                            <p className="text-sm text-muted-foreground">
                                                Maximum number of sets reached
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    {/* Match Summary */}
                    <CardFooter className="bg-muted text-primary border px-4 py-4 rounded-3xl">
                        <div className="w-full space-y-6">
                            {/* Set Navigation Bar */}
                            <div className="flex justify-center gap-2 pb-4">
                                {game.match_details.map((set) => (
                                    <Button
                                        key={set.set}
                                        variant={currentSet.set === set.set ? "default" : "outline"}
                                        size="default"
                                        onClick={() => switchSet({...set, status: set.status as 'not_started' | 'started' | 'completed'})}
                                        className={cn(
                                            "min-w-[80px] relative",
                                            set.status === 'completed' && "border-primary/50",
                                            set.status === 'started' && "border-primary/50"
                                        )}
                                    >
                                        <div>
                                            <div className="font-medium">Set {set.set}</div>
                                            <div className="text-xs opacity-80">{set.player_1_score} - {set.player_2_score}</div>
                                        </div>
                                        {set.status === 'started' && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {/* Match Details */}
                            <div className="space-y-6">
                                {/* Players Header */}
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                    <div className="text-xl font-bold text-center">{game.player_1.name}</div>
                                    <div className="text-sm font-medium">vs</div>
                                    <div className="text-xl font-bold text-center">{game.player_2.name}</div>
                                </div>

                                {/* Sets Table */}
                                <div className="rounded-lg border bg-card">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px] text-center">Set</TableHead>
                                                <TableHead className="text-center">{game.player_1.name}</TableHead>
                                                <TableHead className="text-center">{game.player_2.name}</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-center">Duration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {game.match_details.map((set) => (
                                                <TableRow key={set.set}>
                                                    <TableCell className="text-center font-medium">
                                                        Set {set.set}
                                                    </TableCell>
                                                    <TableCell className="text-center text-2xl font-bold">
                                                        {set.player_1_score}
                                                    </TableCell>
                                                    <TableCell className="text-center text-2xl font-bold">
                                                        {set.player_2_score}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={
                                                            set.status === 'completed' ? "default" :
                                                            set.status === 'started' ? "secondary" :
                                                            "outline"
                                                        }>
                                                            {set.status === 'completed' ? 'Completed' :
                                                             set.status === 'started' ? 'In Progress' :
                                                             'Not Started'}
                                                        </Badge>
                                                        {set.start_at ? (
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {format(new Date(set.start_at), 'HH:mm:ss')}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-muted-foreground mt-1">-</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm text-muted-foreground">
                                                        {set.match_duration ? formatTime(set.match_duration) : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Match Summary */}
                                <div className="grid grid-cols-3 gap-4 items-center bg-muted rounded-lg p-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary">
                                            {game.match_details.filter(set =>
                                                set.status === 'completed' && set.player_1_score > set.player_2_score
                                            ).length}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">Sets Won</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm font-semibold">Match Summary</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {game.match_details.filter(set => set.status === 'completed').length} of 3 Sets Played
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary">
                                            {game.match_details.filter(set =>
                                                set.status === 'completed' && set.player_2_score > set.player_1_score
                                            ).length}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">Sets Won</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
