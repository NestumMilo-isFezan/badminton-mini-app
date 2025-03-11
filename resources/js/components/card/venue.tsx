import PatternedShadow from "@/components/patterned-shadow";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { MapPin } from "lucide-react";
import { DeleteVenueModal } from '@/pages/admin/venue/modal/delete';
import { EditVenueModal } from '@/pages/admin/venue/modal/edit';
import { asset } from '@/lib/utils';

type Venue = {
    id: number;
    image?: string;
    name: string;
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
};

interface VenueCardProps {
    venue: Venue;
}

export function VenueCard({ venue }: { venue: Venue }) {
    const { id, name, address, courts } = venue;
    const formattedAddress = [
        address.address_1,
        address.address_2,
        address.city,
        address.state,
        address.zip
    ].filter(Boolean).join(", ");

    return (
        <div className="px-2 h-full">
            <PatternedShadow size="small">
                <div>
                    <Card className="overflow-hidden transition-all duration-300 h-full border-primary/20 hover:border-primary bg-background group pt-0">
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden">
                            <img src={asset(venue.image || '')} alt={venue.name} className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                        </div>
                        <CardHeader className="px-4 pt-4 pb-0">
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="size-4 shrink-0 mt-0.5" />
                                <span>{formattedAddress}</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {courts.length} Courts
                                </span>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    Open
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <EditVenueModal venue={venue} />
                            <DeleteVenueModal venueId={id} venueName={name} />
                        </CardFooter>
                    </Card>
                </div>
            </PatternedShadow>
        </div>
    );
}
