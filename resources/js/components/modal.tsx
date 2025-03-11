import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ModalComponentProps {
    onClose?: () => void;
    [key: string]: unknown;
}

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<ModalSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: '',
};

export function Modal() {
    const { isOpen, component: Component, props, hideModal } = useModal();
    const size = (props?.size as ModalSize) || 'md';
    const isFullScreen = size === 'full';

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && hideModal()}
        >
            <DialogContent
                className={cn(
                    "transition-all duration-200",
                    sizeClasses[size],
                    isFullScreen && [
                        "!fixed !inset-0 p-0",
                        "!w-screen !h-screen",
                        "!max-w-none !rounded-none !border-0",
                        "!translate-x-0 !translate-y-0 !top-0 !left-0",
                        "flex flex-col overflow-hidden"
                    ]
                )}
            >
                {Component && React.isValidElement(Component)
                    ? React.cloneElement(Component as React.ReactElement<ModalComponentProps>, {
                        ...props,
                        onClose: hideModal
                    })
                    : Component}
            </DialogContent>
        </Dialog>
    );
}
