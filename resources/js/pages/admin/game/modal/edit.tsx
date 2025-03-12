import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler, useEffect, useState } from 'react';
import AppFullScreenModal from '@/components/app-full-screen-modal';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { GameFormSelect } from '@/components/game-form-select';
import { Game } from '@/types';

type AvailableResources = {
    players: Array<{ id: number; name: string }>;
    venues: Array<{ id: number; name: string }>;
    courts: Array<{ id: number; name: string }>;
};

interface EditGameModalContentProps {
    game: Game;
    onClose?: () => void;
}

function EditGameModalContent({ game, onClose }: EditGameModalContentProps) {
    const [availableResources, setAvailableResources] = useState<AvailableResources>({
        players: [],
        venues: [],
        courts: [],
    });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: game.name,
        status: game.status,
        type: game.type,
        venue_id: game.venue.id.toString(),
        court_id: game.court.id.toString(),
        player_1_id: game.player_1.id.toString(),
        player_2_id: game.player_2.id.toString(),
        start_time: game.start_time,
        end_time: game.end_time,
    });

    const handleSelectChange = (field: keyof typeof data) => (value: string) => {
        setData(field, value);
    };

    const fetchAvailableResources = async () => {
        try {
            const response = await fetch(
                route('admin.games.create', {
                    start_time: data.start_time || null,
                    end_time: data.end_time || null,
                    venue: data.venue_id || null,
                })
            );
            const resources = await response.json();
            setAvailableResources(resources);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchAvailableResources();
    }, []);

    useEffect(() => {
        fetchAvailableResources();
    }, [data.start_time, data.end_time]);

    useEffect(() => {
        if (data.venue_id) {
            fetchAvailableResources();
        } else {
            setAvailableResources(prev => ({ ...prev, courts: [] }));
            setData('court_id', '');
        }
    }, [data.venue_id]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.games.update', game.id), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <form id="edit-game-form" onSubmit={handleSubmit}>
            <AppFullScreenModal
                title="Edit Game"
                onClose={onClose}
                isSubmitting={processing}
                submitLabel="Save Changes"
                form="edit-game-form"
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Game Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter game name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <DateTimePicker
                                value={data.start_time}
                                onChange={(value) => setData('start_time', value)}
                                disabled={processing}
                            />
                            <InputError message={errors.start_time} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <DateTimePicker
                                value={data.end_time}
                                onChange={(value) => setData('end_time', value)}
                                disabled={processing}
                            />
                            <InputError message={errors.end_time} />
                        </div>
                    </div>

                    <GameFormSelect
                        label="Venue"
                        options={availableResources.venues}
                        value={data.venue_id}
                        onChange={handleSelectChange('venue_id')}
                        error={errors.venue_id}
                        placeholder="Select venue"
                        disabled={processing}
                        required
                    />

                    <GameFormSelect
                        label="Court"
                        options={availableResources.courts}
                        value={data.court_id}
                        onChange={handleSelectChange('court_id')}
                        error={errors.court_id}
                        placeholder="Select court"
                        disabled={processing || !data.venue_id}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <GameFormSelect
                            label="Player 1"
                            options={availableResources.players}
                            value={data.player_1_id}
                            onChange={handleSelectChange('player_1_id')}
                            error={errors.player_1_id}
                            placeholder="Select player 1"
                            disabled={processing}
                            required
                        />

                        <GameFormSelect
                            label="Player 2"
                            options={availableResources.players}
                            value={data.player_2_id}
                            onChange={handleSelectChange('player_2_id')}
                            error={errors.player_2_id}
                            placeholder="Select player 2"
                            disabled={processing}
                            required
                        />
                    </div>
                </div>
            </AppFullScreenModal>
        </form>
    );
}

interface EditGameModalProps {
    game: Game;
}

export function EditGameModal({ game }: EditGameModalProps) {
    const { showModal } = useModal();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        showModal(<EditGameModalContent game={game} />, {
            size: 'full'
        });
    };

    return (
        <Button variant="outline" onClick={handleClick} size="sm">
            Edit
        </Button>
    );
}
