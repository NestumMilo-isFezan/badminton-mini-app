import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

interface DeleteVenueModalContentProps {
    venueId: number;
    venueName: string;
    onClose?: () => void;
}

function DeleteVenueModalContent({ venueId, venueName, onClose }: DeleteVenueModalContentProps) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        destroy(route('admin.venues.destroy', venueId), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Venue</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete <span className="font-semibold">{venueName}</span>? This action will also delete all associated courts and cannot be undone.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={processing}
                >
                    Delete Venue
                </Button>
            </DialogFooter>
        </>
    );
}

interface DeleteVenueModalProps {
    venueId: number;
    venueName: string;
}

export function DeleteVenueModal({ venueId, venueName }: DeleteVenueModalProps) {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<DeleteVenueModalContent venueId={venueId} venueName={venueName} />, {
            size: 'sm'
        });
    };

    return (
        <Button variant="destructive" onClick={handleClick} size="sm">
            Delete
        </Button>
    );
}
