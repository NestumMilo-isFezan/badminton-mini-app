import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Delete, Trash } from "lucide-react";

interface DeleteGameModalContentProps {
    gameId: number;
    gameName: string;
    onClose?: () => void;
}

function DeleteGameModalContent({ gameId, gameName, onClose }: DeleteGameModalContentProps) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        destroy(route('admin.games.destroy', gameId), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Cancel Schedule</DialogTitle>
                <DialogDescription>
                    Are you sure you want to cancel the schedule for <span className="font-semibold">{gameName}</span>? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant="outline"
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
                    Cancel Schedule
                </Button>
            </DialogFooter>
        </>
    );
}

interface DeleteGameModalProps {
    gameId: number;
    gameName: string;
}

export function DeleteGameModal({ gameId, gameName }: DeleteGameModalProps) {
    const { showModal } = useModal();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        showModal(<DeleteGameModalContent gameId={gameId} gameName={gameName} />, {
            size: 'sm'
        });
    };

    return (
        <Button variant="destructive" onClick={handleClick} size="sm">
            <span><Trash /></span>
            <span className="hidden md:block">Cancel Schedule</span>
        </Button>
    );
}
