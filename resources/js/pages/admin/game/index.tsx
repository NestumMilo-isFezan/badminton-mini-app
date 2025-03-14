import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type PaginatedData, type Game } from '@/types';
import { Head, router } from '@inertiajs/react';
import { GameCard } from '@/components/card/game';
import { Button } from '@/components/ui/button';
import { CreateGameModal } from '@/pages/admin/game/modal/create';
import Pagination from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Tournaments',
        href: route('admin.games.index'),
    },
];

interface Props {
    games: PaginatedData<Game>;
}

export default function Index({ games }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tournaments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className='flex justify-end w-full px-3.5'>
                    <Button asChild>
                        <CreateGameModal />
                    </Button>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl px-3.5">
                    <div className="flex flex-col">
                        {games.data.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                            />
                        ))}
                    </div>

                    <Pagination meta={games.meta} className="mt-6" />
                </div>
            </div>
        </AppLayout>
    );
}
