import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { type ReactNode } from 'react';

interface AppFullScreenModalProps {
    title: string;
    children: ReactNode;
    onClose?: () => void;
    isSubmitting?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    showFooter?: boolean;
    form?: string;
}

export default function AppFullScreenModal({
    title,
    children,
    onClose,
    isSubmitting,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    showFooter = true,
    form,
}: AppFullScreenModalProps) {
    return (
        <div className="flex h-screen flex-col">
            {/* Fixed Header */}
            <DialogHeader className="border-b px-6 py-4 flex-none">
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4">
                    {children}
                </div>
            </div>

            {/* Fixed Footer */}
            {showFooter && (
                <DialogFooter className="border-t px-6 py-4 flex-none">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        type="button"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="submit"
                        form={form}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {submitLabel}
                    </Button>
                </DialogFooter>
            )}
        </div>
    );
}
