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
import { useDateTime } from '@/hooks/use-date-time';

type GameForm = {
    name: string;
    status: string;
    type: string;
    venue_id: string;
    court_id: string;
    player_1_id: string;
    player_2_id: string;
    start_time: string;
};

type AvailableResources = {
    players: Array<{ id: number; name: string }>;
    venues: Array<{ id: number; name: string }>;
    courts: Array<{ id: number; name: string }>;
};

type SelectOption = {
    value: string;
    label: string;
};

function CreateGameModalContent({ onClose }: { onClose?: () => void }) {
    const { toLocalDate, toUTCString, TIMEZONE } = useDateTime();

    const [availableResources, setAvailableResources] = useState<AvailableResources>({
        players: [],
        venues: [],
        courts: [],
    });

    const { data, setData, post, processing, errors } = useForm<GameForm>({
        name: '',
        status: 'pending',
        type: 'single',
        venue_id: '',
        court_id: '',
        player_1_id: '',
        player_2_id: '',
        start_time: '',
    });

    const handleSelectChange = (field: keyof GameForm) => (value: string) => {
        setData(field, value);
    };

    const handleDateTimeChange = (date: Date) => {
        setData('start_time', toUTCString(date));
        console.log(data.start_time);
    };

    const fetchAvailableResources = async () => {
        try {
            const response = await fetch(
                route('admin.games.create', {
                    start_time: data.start_time || null,
                    venue: data.venue_id || null,  // Keep this as 'venue' to match the backend
                })
            );
            const resources = await response.json();
            setAvailableResources(resources);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    // Initial fetch when component mounts
    useEffect(() => {
        fetchAvailableResources();
    }, []);

    // Fetch when time changes
    useEffect(() => {
        fetchAvailableResources();
    }, [data.start_time]);

    // Fetch when venue changes
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
        post(route('admin.games.store'), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <form id="create-game-form" onSubmit={handleSubmit}>
            <AppFullScreenModal
                title="Create Game"
                onClose={onClose}
                isSubmitting={processing}
                submitLabel="Create Game"
                form="create-game-form"
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

                    <div className="grid gap-2">
                        <Label htmlFor="start_time">Start Time (Malaysia Time)</Label>
                        <DateTimePicker
                            date={toLocalDate(data.start_time)}
                            onDateChange={handleDateTimeChange}
                            showEndTime={false}
                        />
                        <InputError message={errors.start_time} />
                    </div>

                    <GameFormSelect
                        label="Venue"
                        options={availableResources.venues}
                        value={data.venue_id}
                        onChange={handleSelectChange('venue_id')}
                        error={errors.venue_id}
                        placeholder={availableResources.venues.length ? "Select venue" : "No venues available"}
                        disabled={processing || !availableResources.venues.length}
                        required
                    />

                    <GameFormSelect
                        label="Court"
                        options={availableResources.courts}
                        value={data.court_id}
                        onChange={handleSelectChange('court_id')}
                        error={errors.court_id}
                        placeholder={
                            !data.venue_id
                                ? "Select a venue first"
                                : availableResources.courts.length
                                    ? "Select court"
                                    : "No courts available"
                        }
                        disabled={processing || !data.venue_id || !availableResources.courts.length}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <GameFormSelect
                            label="Player 1"
                            options={availableResources.players}
                            value={data.player_1_id}
                            onChange={handleSelectChange('player_1_id')}
                            error={errors.player_1_id}
                            placeholder={availableResources.players.length ? "Select player 1" : "No players available"}
                            disabled={processing || !availableResources.players.length}
                            required
                        />

                        <GameFormSelect
                            label="Player 2"
                            options={availableResources.players}
                            value={data.player_2_id}
                            onChange={handleSelectChange('player_2_id')}
                            error={errors.player_2_id}
                            placeholder={availableResources.players.length ? "Select player 2" : "No players available"}
                            disabled={processing || !availableResources.players.length}
                            required
                        />
                    </div>
                </div>
            </AppFullScreenModal>
        </form>
    );
}

export function CreateGameModal() {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<CreateGameModalContent />, {
            size: 'full'
        });
    };

    return (
        <Button onClick={handleClick}>Create Game</Button>
    );
}
