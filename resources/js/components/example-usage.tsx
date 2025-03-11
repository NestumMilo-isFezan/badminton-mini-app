import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Regular modal content example
function ExampleModalContent({ onClose, customProp }: { onClose?: () => void; customProp?: string }) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Example Modal</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <p>This is a regular modal with proper layout and scrolling.</p>
            </div>
            <DialogFooter>
                <Button onClick={onClose}>Close</Button>
            </DialogFooter>
        </>
    );
}

// Full screen modal content example
function FullScreenModalContent({ onClose }: { onClose?: () => void }) {
    return (
        <>
            <DialogHeader className="border-b px-4 py-5">
                <DialogTitle>Full Screen Modal</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-auto">
                <div className="mx-auto max-w-4xl py-6">
                    <p>This is a full-screen modal with proper layout and scrolling.</p>
                    {/* Add more content here */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <p key={i} className="mt-4">
                            Scroll content {i + 1}
                        </p>
                    ))}
                </div>
            </div>

            <DialogFooter className="border-t px-4 py-5">
                <div className="flex w-full justify-end px-5">
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </DialogFooter>
        </>
    );
}

// Example component that shows the modal
export function ExampleComponent() {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<ExampleModalContent />, {
            size: 'sm',
            customProp: 'Hello from modal!'
        });
    };

    const handleFullScreenModal = () => {
        showModal(<FullScreenModalContent />, {
            size: 'full'
        });
    };

    return (
        <div className="space-x-4">
            <Button onClick={handleClick}>Open Regular Modal</Button>
            <Button onClick={handleFullScreenModal}>Open Full Screen Modal</Button>
        </div>
    );
}
