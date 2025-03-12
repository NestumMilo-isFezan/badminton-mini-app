import PatternedShadow from "@/components/patterned-shadow";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, User } from "lucide-react";
import { asset } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useModal } from '@/hooks/use-modal';
import { GameModalContent } from './game-modal';
import { Button } from "@/components/ui/button";
import { EditGameModal } from '@/pages/admin/game/modal/edit';
import { DeleteGameModal } from '@/pages/admin/game/modal/delete';

interface Game {
    id: number;
    name: string;
    status: string;
    type: string;
    venue: {
        id: number;
        name: string;
        image: string | null;
        address: {
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        }
    };
    court: {
        id: number;
        name: string;
    };
    player_1: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        matches: number;
        wins: number;
        losses: number;
    };
    player_2: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        matches: number;
        wins: number;
        losses: number;
    };
    start_time: string;
    end_time: string;
    scores: Array<{
        set: number;
        player_1_score: number;
        player_2_score: number;
    }>;
    winner: {
        id: number | null;
        name: string | null;
        avatar: string | null;
    };
    umpire: {
        id: number | null;
        name: string | null;
        avatar: string | null;
    };
}

interface GameCardProps {
    game: Game;
}

const toSentenceCase = (str: string): string => {
    return str.replace('_', ' ').charAt(0).toUpperCase() + str.replace('_', ' ').slice(1);
};

export function GameCard({ game }: GameCardProps) {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<GameModalContent game={game} />, {
            size: 'full'
        });
    };

    const {
        name,
        venue,
        court,
        player_1,
        player_2,
        start_time,
        end_time,
        status,
        scores,
        winner,
        umpire
    } = game;

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
        }
    };

    const getPlayerCardStyle = (playerId: number) => {
        if (winner?.id === playerId) {
            return 'border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30';
        }
        return 'bg-card hover:bg-muted/50 border-border';
    };

    return (
        <div className="px-2">
            <PatternedShadow size="small">
                <Card
                    className="overflow-hidden transition-all duration-300 border-primary/20 hover:border-primary bg-background cursor-pointer py-0"
                    onClick={handleClick}
                >
                    <div className="p-4 flex items-center gap-4">
                        {/* Left section - Game info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium truncate">{name}</h3>
                            <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{venue.name} - {court.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{format(new Date(start_time), 'dd MMM yyyy HH:mm')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle section - Players */}
                        <div className="flex-1 flex items-center gap-2 min-w-[200px]">
                            <div className="flex-1 text-sm">
                                <div className="font-medium truncate">{player_1.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    Win Rate: {player_1.win_rate}%
                                </div>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">vs</div>
                            <div className="flex-1 text-sm text-right">
                                <div className="font-medium truncate">{player_2.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    Win Rate: {player_2.win_rate}%
                                </div>
                            </div>
                        </div>

                        {/* Right section - Status & Score */}
                        <div className="flex flex-col items-end gap-2">
                            <Badge
                                variant={status === 'completed' ? 'default' : 'secondary'}
                                className={getStatusBadgeColor(status)}
                            >
                                {toSentenceCase(status)}
                            </Badge>
                            {scores.length > 0 && (
                                <div className="text-sm font-medium">
                                    {scores.map((score, index) => (
                                        <span key={index} className="ml-2">
                                            {score.player_1_score}-{score.player_2_score}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <CardFooter className="flex justify-end gap-2 border-t p-4">
                        <EditGameModal game={game} />
                        <DeleteGameModal gameId={game.id} gameName={game.name} />
                    </CardFooter>
                </Card>
            </PatternedShadow>
        </div>
    );
}
