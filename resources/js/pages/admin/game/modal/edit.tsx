import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppFullScreenModal from '@/components/app-full-screen-modal';
import { Game } from '@/types';

interface EditGameModalContentProps {
    game: Game;
    onClose?: () => void;
}

function EditGameModalContent({ game, onClose }: EditGameModalContentProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        // Add your form fields here based on your game data structure
        name: game.name,
        // ... other fields
    });

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
                {/* Add your form fields here */}
                <div className="flex flex-col gap-8 px-4">
                    {/* Add form content based on your requirements */}
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