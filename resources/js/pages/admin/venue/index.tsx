import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
import { VenueCard } from '@/components/card/venue';
import { Button } from '@/components/ui/button';
import { CreateVenueModal } from '@/pages/admin/venue/modal/create';
import Pagination from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Venues',
        href: route('admin.venues.index'),
    },
];

interface Venue {
    id: number;
    name: string;
    image?: string;
    address: {
        address_1: string;
        address_2: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    },
    courts: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    venues: PaginatedData<Venue>;
}

export default function Index({ venues }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Venues" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className='flex justify-end w-full px-3.5'>
                    <Button asChild>
                        <CreateVenueModal />
                    </Button>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl px-3.5">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {venues.data.map((venue) => (
                            <VenueCard
                                key={venue.id}
                                venue={venue}
                            />
                        ))}
                    </div>

                    <Pagination meta={venues.meta} className="mt-6" />
                </div>
            </div>
        </AppLayout>
    );
}
