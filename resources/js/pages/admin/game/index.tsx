import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
import { GameCard } from '@/components/card/game';
import { Button } from '@/components/ui/button';
// import { CreateGameModal } from '@/pages/admin/game/modal/create';
import Pagination from '@/components/ui/pagination';
import { mockGames } from './mock-data';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Tournaments',
        href: route('admin.games.index'),
    },
];

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

interface Props {
    games?: PaginatedData<Game>;
}

export default function Index({ games }: Props) {
    // Create a mock paginated data structure
    const mockPaginatedGames: PaginatedData<Game> = {
        data: mockGames,
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: '',
            per_page: 10,
            to: mockGames.length,
            total: mockGames.length,
        }
    };

    // Use either the provided games prop or the mock data
    const displayGames = games || mockPaginatedGames;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tournaments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className='flex justify-end w-full px-3.5'>
                    <Button asChild>
                        {/* <CreateVenueModal /> */}
                    </Button>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl px-3.5">
                    <div className="flex flex-col">
                        {displayGames.data.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                            />
                        ))}
                    </div>

                    <Pagination meta={displayGames.meta} className="mt-6" />
                </div>
            </div>
        </AppLayout>
    );
}
