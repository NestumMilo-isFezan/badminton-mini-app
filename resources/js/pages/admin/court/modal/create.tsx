import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import AppFullScreenModal from '@/components/app-full-screen-modal';

type CourtForm = {
    name: string;
    venue_id: number;
};

function CreateCourtModalContent({ venueId, onClose }: { venueId: number; onClose?: () => void }) {
    const { data, setData, post, processing, errors } = useForm<Required<CourtForm>>({
        name: '',
        venue_id: venueId,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.courts.store'), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <form id="create-court-form" onSubmit={handleSubmit}>
            <AppFullScreenModal
                title="Create Court"
                onClose={onClose}
                isSubmitting={processing}
                submitLabel="Create Court"
                form="create-court-form"
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Court Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter court name"
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>
                </div>
            </AppFullScreenModal>
        </form>
    );
}

export function CreateCourtModal({ venueId }: { venueId: number }) {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<CreateCourtModalContent venueId={venueId} />, {
            size: 'full'
        });
    };

    return (
        <Button onClick={handleClick}>Add Court</Button>
    );
}
