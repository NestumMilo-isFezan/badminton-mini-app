import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import AppFullScreenModal from '@/components/app-full-screen-modal';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Game, PaginatedData } from "@/types"
import { router, useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils";
import { Timer } from '@/components/timer';

/**
 * Badminton Game Scoring System Component
 *
 * This component manages the scoring interface for a badminton game, including:
 * - Match initialization and set management
 * - Real-time score tracking for both players
 * - Set status management (not_started, started, completed)
 * - Server tracking (Player A/B)
 * - Match duration tracking
 *
 * Key Features:
 * - Supports multiple sets per match
 * - Real-time score updates with server-side persistence
 * - Score increment/decrement functionality
 * - Match state management (start, in progress, completion)
 *
 * Data Flow:
 * 1. Initial game data loaded from props
 * 2. Local state manages current scores and game status
 * 3. Updates synchronized with backend via Inertia.js routes
 * 4. Score changes trigger immediate UI updates and backend persistence
 *
 * Routes Required:
 * - POST   /admin/games/{game}/scores          - Create new score/set
 * - PUT    /admin/games/{game}/scores/{score}  - Update existing score
 * - PUT    /admin/games/{game}/scores/{score}/start  - Start a set
 *
 * @component
 * @requires useModal - Modal management hook
 * @requires Game - Game type definition
 * @requires inertiajs/react - Inertia.js React adapter
 */

interface ScoreboardProps {
    game: Game;
    onClose?: () => void;
}

type GameScore = {
    id: number;
    game_id: number;
    set: number;
    player_1: {
        id: number;
        score: number;
    };
    player_2: {
        id: number;
        score: number;
    };
    start_at: string | null;
    match_duration: string | null;
    status: string;
};

interface ScoreResponse {
    props: {
        score: {
            id: number;
            game_id: number;
            set: number;
            player_1_score: number;
            player_2_score: number;
            start_at: string | null;
            match_duration: string | null;
        }
    }
}

function ScoreboardContent({ game, onClose }: ScoreboardProps) {
    const { data, setData, post, put, processing } = useForm({
        set: 1,
        player_1_score: 0,
        player_2_score: 0,
        serving: "A",
        match_duration: "00:00:00",
        player_1_id: game.player_1?.id,
        player_2_id: game.player_2?.id,
    });

    const [teamAScore, setTeamAScore] = useState(0);
    const [teamBScore, setTeamBScore] = useState(0);
    const [serving, setServing] = useState("A");
    const [currentSet, setCurrentSet] = useState(1);
    const [isMatchStarted, setIsMatchStarted] = useState(game.scores.length > 0);
    const [isCreatingMatch, setIsCreatingMatch] = useState(false);
    const [currentMatchDuration, setCurrentMatchDuration] = useState<string>("00:00:00");

    // Add new state for tracking latest set
    const [latestSet, setLatestSet] = useState(() => {
        const maxSet = Math.max(...(game.scores?.map(s => s.set) || [0]));
        return maxSet || 1;
    });

    const mapScoreData = (score: any, gameData: any): GameScore => ({
        id: score?.id || 0,
        game_id: score?.game_id || gameData?.id || 0,
        set: score?.set || 1,
        player_1: {
            id: gameData?.player_1?.id || 0,
            score: score?.player_1_score || 0,
        },
        player_2: {
            id: gameData?.player_2?.id || 0,
            score: score?.player_2_score || 0,
        },
        start_at: score?.start_at || null,
        match_duration: score?.match_duration || null,
        status: score?.status || 'not_started',
    });

    const [gameScores, setGameScores] = useState<GameScore[]>(() => {
        if (game?.scores?.length > 0 && game.player_1?.id && game.player_2?.id) {
            return game.scores.map(score => mapScoreData(score, game));
        }
        // Return initial empty state with proper structure
        return [mapScoreData({}, game)];
    });

    useEffect(() => {
        if (isCreatingMatch) {
            router.reload({
                onSuccess: (page) => {
                    const updatedGame = (page as unknown as { props: { games: PaginatedData<Game> } }).props.games.data[0];

                    if (!updatedGame) {
                        console.error('Failed to load game data');
                        setIsCreatingMatch(false);
                        return;
                    }

                    const scores = updatedGame.scores || [];
                    setGameScores(scores.map(score => mapScoreData(score, updatedGame)));
                    setIsMatchStarted(true);
                    setIsCreatingMatch(false);
                },
                onError: (errors) => {
                    console.error('Error reloading game data:', errors);
                    setIsCreatingMatch(false);
                }
            });
        }
    }, [isCreatingMatch]);

    const handleStartMatch = () => {
        setIsCreatingMatch(true);
        post(route('admin.games.scores.store', { game: game.id }), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Add cleanup for unmounting
    useEffect(() => {
        return () => {
            // Cleanup any subscriptions or timers
            setGameScores([]);
            setTeamAScore(0);
            setTeamBScore(0);
        };
    }, []);

    // Helper to get current set's score or create initial structure
    const getCurrentSetScore = (): GameScore => {
        const currentScore = gameScores.find(score => score.set === currentSet);

        if (currentScore) {
            return currentScore;
        }

        // Return a safe default structure
        return {
            id: 0,
            game_id: game.id,
            set: currentSet,
            player_1: {
                id: game.player_1?.id || 0,
                score: 0,
            },
            player_2: {
                id: game.player_2?.id || 0,
                score: 0,
            },
            start_at: null,
            match_duration: null,
            status: 'not_started',
        };
    };

    const handleStartSet = () => {
        const currentScore = getCurrentSetScore();

        // Don't proceed if we don't have a valid score ID
        if (currentScore.id === 0) {
            console.error('Cannot start set: Invalid score ID');
            return;
        }

        router.put(route('admin.games.scores.start', {
            game: game.id,
            score: currentScore.id
        }), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const updatedGame = (page as unknown as { props: { games: PaginatedData<Game> } }).props.games.data[0];
                if (updatedGame) {
                    const scores = updatedGame.scores || [];
                    setGameScores(scores.map(score => mapScoreData(score, updatedGame)));
                }
            }
        });
    };

    const updateGameScore = (player: 'player_1' | 'player_2', action: 'increment' | 'decrement') => {
        const currentScore = getCurrentSetScore();
        const updatedScores = gameScores.map(score => {
            if (score.set === currentSet) {
                return {
                    ...score,
                    [player]: {
                        ...score[player],
                        score: action === 'increment' ? score[player].score + 1 : Math.max(0, score[player].score - 1)
                    }
                };
            }
            return score;
        });
        setGameScores(updatedScores);
    };

    const handleScoreChange = (player: 'player_1' | 'player_2', action: 'increment' | 'decrement') => {
        const currentScore = getCurrentSetScore();

        // Only proceed if we have a valid score ID
        if (currentScore.id === 0) {
            return; // Don't allow score changes before the set is started
        }

        put(route('admin.games.scores.update', { game: game.id, score: currentScore.id }), {
            player_id: currentScore[player].id,
            action: action
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                updateGameScore(player, action);
            },
            onError: (errors) => {
                console.error('Error updating score:', errors);
            }
        });
    };

    const toggleServe = () => {
        setData('serving', data.serving === "A" ? "B" : "A");
    }

    const handleFinishSet = () => {
        const currentScore = getCurrentSetScore();

        router.put(route('admin.games.scores.finish', {
            game: game.id,
            score: currentScore.id
        }), {
            match_duration: currentMatchDuration
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const updatedGame = (page as unknown as { props: { games: PaginatedData<Game> } }).props.games.data[0];
                if (updatedGame) {
                    const scores = updatedGame.scores || [];
                    setGameScores(scores.map(score => mapScoreData(score, updatedGame)));
                }
            }
        });
    };

    const handleNextSet = () => {
        const nextSet = currentSet + 1;
        if (nextSet <= 3) {
            router.post(route('admin.games.scores.store', { game: game.id }), {
                set: nextSet,
                player_1_id: game.player_1?.id,
                player_2_id: game.player_2?.id,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    const updatedGame = (page as unknown as { props: { games: PaginatedData<Game> } }).props.games.data[0];
                    if (updatedGame) {
                        const scores = updatedGame.scores || [];
                        setGameScores(scores.map(score => mapScoreData(score, updatedGame)));
                        setCurrentSet(nextSet);
                        setTeamAScore(0);
                        setTeamBScore(0);
                        setServing("A");
                    }
                }
            });
        }
    };

    // Simplified SetControls component
    const SetControls = () => {
        const currentScore = getCurrentSetScore();

        if (!isMatchStarted) {
            return (
                <Button size="lg" className="w-full" onClick={handleStartMatch}>
                    Start Match
                </Button>
            );
        }

        if (currentScore.status === 'completed') {
            if (currentSet < 3) {
                return (
                    <Button size="lg" className="w-full" onClick={handleNextSet}>
                        Start Set {currentSet + 1}
                    </Button>
                );
            }
            return (
                <div className="text-center text-muted-foreground">
                    Match Completed
                </div>
            );
        }

        // Add check for valid score ID
        if (currentScore.status === 'not_started' && currentScore.id !== 0) {
            return (
                <Button size="lg" className="w-full" onClick={handleStartSet}>
                    Start Set {currentSet}
                </Button>
            );
        }

        // Only show finish button if we have a valid score and it's started
        if (currentScore.id !== 0 && currentScore.status === 'started') {
            return (
                <Button
                    size="lg"
                    variant="destructive"
                    className="w-full"
                    onClick={handleFinishSet}
                >
                    Finish Set {currentSet}
                </Button>
            );
        }

        // Show loading or waiting state if we don't have a valid score yet
        return (
            <div className="text-center text-muted-foreground">
                Initializing Set...
            </div>
        );
    };

    useEffect(() => {
        const currentSetScores = game.scores.find(s => s.set === currentSet);
        if (currentSetScores) {
            setTeamAScore(currentSetScores.player_1_score);
            setTeamBScore(currentSetScores.player_2_score);
        }
    }, [currentSet]);

    // Add a safety check for the Timer component
    const getSetStartTime = () => {
        const currentScore = getCurrentSetScore();
        return currentScore?.start_at || null;
    };

    // Add score navigation component
    const ScoreNavigation = () => {
        return (
            <div className="flex gap-2 justify-center mt-4">
                {gameScores.map((score, index) => (
                    <Button
                        key={score.set}
                        variant={currentSet === score.set ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentSet(score.set)}
                        className={cn(
                            "min-w-[60px]",
                            currentSet === score.set && "ring-2 ring-primary"
                        )}
                    >
                        Set {score.set}
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <AppFullScreenModal title="Game Score" onClose={onClose} showFooter={false}>
            <div className='w-full h-[85vh] flex justify-center items-center'>
                {!isMatchStarted ? (
                    <Card className="w-[400px] text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl">Start New Match</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">{game.player_1.name}</h3>
                                <span className="text-xl">vs</span>
                                <h3 className="text-lg font-semibold">{game.player_2.name}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Venue: {game.venue.name}</p>
                                <p>Court: {game.court.name}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <SetControls />
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="w-full h-full p-0 bg-primary">
                        <CardHeader className="text-primary-foreground text-center p-4">
                            <CardTitle className="text-2xl">SINGLE MATCH</CardTitle>
                            <div className="text-sm">3 Sets of 21 points</div>
                        </CardHeader>

                        <CardContent className="p-4 flex bg-white h-full w-full justify-center items-center">
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {/* Player 1 */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-2">{game.player_1.name}</h2>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleScoreChange('player_1', 'decrement')}
                                            className="h-20 min-w-10"
                                            disabled={getCurrentSetScore().status !== 'started'}
                                        >
                                            -
                                        </Button>

                                        <div className="bg-muted rounded-md pt-8 flex flex-col w-full max-w-[150px] border-2">
                                            <span className="text-6xl font-bold pb-4">{getCurrentSetScore().player_1.score}</span>
                                            {serving === "A" && (
                                                <div className="mt-2 bg-destructive text-xs text-white font-bold p-1 rounded-b">
                                                    Serve Now
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleScoreChange('player_1', 'increment')}
                                            className="h-20 min-w-10"
                                            disabled={getCurrentSetScore().status !== 'started'}
                                        >
                                            +
                                        </Button>
                                    </div>

                                    {serving === "B" && (
                                        <Button variant="secondary" size="sm" className="mt-2" onClick={toggleServe}>
                                            Toggle Serve
                                        </Button>
                                    )}
                                </div>

                                {/* Middle Section */}
                                <div className="text-center h-full w-full flex flex-col justify-center gap-4">
                                    <div className="space-y-4">
                                        <div className="text-2xl font-bold">SET {currentSet}</div>

                                        <Timer
                                            startTime={getSetStartTime()}
                                            isRunning={getCurrentSetScore().status === 'started'}
                                            onTick={(duration) => {
                                                setCurrentMatchDuration(duration);
                                            }}
                                        />

                                        <SetControls />
                                    </div>
                                </div>

                                {/* Player 2 */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-2">{game.player_2.name}</h2>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleScoreChange('player_2', 'decrement')}
                                            className="h-20 min-w-10"
                                            disabled={getCurrentSetScore().status !== 'started'}
                                        >
                                            -
                                        </Button>

                                        <div className="bg-muted rounded-md pt-8 flex flex-col w-full max-w-[150px] border-2">
                                            <span className="text-6xl font-bold pb-4">{getCurrentSetScore().player_2.score}</span>
                                            {serving === "B" && (
                                                <div className="mt-2 bg-destructive text-xs text-white font-bold p-1 rounded-b">
                                                    Serve Now
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleScoreChange('player_2', 'increment')}
                                            className="h-20 min-w-10"
                                            disabled={getCurrentSetScore().status !== 'started'}
                                        >
                                            +
                                        </Button>
                                    </div>

                                    {serving === "A" && (
                                        <Button variant="secondary" size="sm" className="mt-2" onClick={toggleServe}>
                                            Toggle Serve
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="text-primary-foreground p-4 pb-8">
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {[1, 2, 3].map((setNumber) => {
                                    const score = gameScores.find(s => s.set === setNumber);
                                    return (
                                        <div
                                            key={setNumber}
                                            className={cn(
                                                "p-2 rounded text-center",
                                                currentSet === setNumber
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-secondary-foreground",
                                                !score && "opacity-50"
                                            )}
                                        >
                                            <div className="text-xs flex items-center justify-between px-2">
                                                <span>Set {setNumber}</span>
                                                {score && (
                                                    <span className={cn(
                                                        "text-xs px-1.5 py-0.5 rounded",
                                                        score.status === 'completed' && "bg-green-500/20",
                                                        score.status === 'started' && "bg-blue-500/20",
                                                        score.status === 'not_started' && "bg-gray-500/20"
                                                    )}>
                                                        {score.status.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-bold mt-1">
                                                {score
                                                    ? `${score.player_1.score} : ${score.player_2.score}`
                                                    : "-"
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardFooter>
                    </Card>
                )}
            </div>

        </AppFullScreenModal>
    )
}

interface ScoreModalProps {
    game: Game;
}

export function ScoreModal({ game }: ScoreModalProps) {
    const { showModal } = useModal();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop event from bubbling up to the card
        showModal(<ScoreboardContent game={game} />, { size: 'full' });
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
        >
            Score
        </Button>
    );
}
