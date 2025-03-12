import AppFullScreenModal from '@/components/app-full-screen-modal';
import { format } from 'date-fns';
import { MapPin, Clock, User, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Game } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import InputError from '@/components/input-error';

interface GameModalContentProps {
    game: Game;
    onClose?: () => void;
}

export function GameModalContent({ game, onClose }: GameModalContentProps) {
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

    if (!game) {
        return <InputError message="Game data not found" />;
    }

    return (
        <AppFullScreenModal
            title={name || 'Untitled Game'}
            onClose={onClose}
            showFooter={false}
        >
            <div className="space-y-6">
                {/* Venue & Time Section */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Location & Time</h3>
                    <Card className="border-primary py-4">
                        <CardContent className="px-4 text-primary">
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-4 h-4" />
                                    {venue && court ? (
                                        <span>{venue.name} - {court.name}</span>
                                    ) : (
                                        <InputError message="Venue or court information missing" />
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Clock className="w-4 h-4" />
                                    <div>
                                        {start_time ? (
                                            <div>Start: {format(new Date(start_time), 'dd MMM yyyy HH:mm')}</div>
                                        ) : (
                                            <InputError message="Start time not set" />
                                        )}
                                        {end_time ? (
                                            <div>End: {format(new Date(end_time), 'dd MMM yyyy HH:mm')}</div>
                                        ) : (
                                            <InputError message="End time not set" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Players Section */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Players</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Player 1 */}
                        {player_1 ? (
                            <Card className={`border-primary ${winner?.id === player_1.id ? 'bg-yellow-50/50 dark:bg-yellow-950/30' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {winner?.id === player_1.id && (
                                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                                )}
                                                <div className="font-medium">{player_1.name}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                <div>Matches: {player_1.matches ?? 0}</div>
                                                <div>Win Rate: {player_1.win_rate ?? 0}%</div>
                                                <div>W/L: {player_1.wins ?? 0}/{player_1.losses ?? 0}</div>
                                            </div>
                                        </div>
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={player_1.avatar ?? ''} alt={player_1.name} />
                                            <AvatarFallback>
                                                <User className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-primary">
                                <CardContent className="p-4">
                                    <InputError message="Player 1 information missing" />
                                </CardContent>
                            </Card>
                        )}

                        {/* Player 2 */}
                        {player_2 ? (
                            <Card className={`border-primary ${winner?.id === player_2.id ? 'bg-yellow-50/50 dark:bg-yellow-950/30' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {winner?.id === player_2.id && (
                                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                                )}
                                                <div className="font-medium">{player_2.name}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                <div>Matches: {player_2.matches ?? 0}</div>
                                                <div>Win Rate: {player_2.win_rate ?? 0}%</div>
                                                <div>W/L: {player_2.wins ?? 0}/{player_2.losses ?? 0}</div>
                                            </div>
                                        </div>
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={player_2.avatar ?? ''} alt={player_2.name} />
                                            <AvatarFallback>
                                                <User className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-primary">
                                <CardContent className="p-4">
                                    <InputError message="Player 2 information missing" />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Scores Section */}
                {scores?.length > 0 ? (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Scores</h3>
                        <Card className="border-primary">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Set</TableHead>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    {winner?.id === player_1?.id && (
                                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                    {player_1?.name}
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    {winner?.id === player_2?.id && (
                                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                    {player_2?.name}
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.map((score, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{score?.player_1_score ?? '-'}</TableCell>
                                                <TableCell>{score?.player_2_score ?? '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Scores</h3>
                        <Card className="border-primary">
                            <CardContent className="p-4">
                                <InputError message="No scores available" />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Umpire Section */}
                {umpire?.id ? (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Umpire</h3>
                        <Card className="border-primary">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={umpire.avatar ?? ''} alt={umpire.name ?? ''} />
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{umpire.name}</div>
                                        <div className="text-sm text-muted-foreground">Match Official</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Umpire</h3>
                        <Card className="border-primary">
                            <CardContent className="p-4">
                                <InputError message="No umpire assigned" />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppFullScreenModal>
    );
}
