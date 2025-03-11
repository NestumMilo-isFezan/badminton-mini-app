import { create } from '@/lib/create-context';
import * as React from 'react';

interface ModalProps {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    [key: string]: unknown;
}

interface ModalState {
    isOpen: boolean;
    component: React.ReactNode | null;
    props?: ModalProps;
}

interface ModalContextValue extends ModalState {
    showModal: (component: React.ReactNode, props?: ModalProps) => void;
    hideModal: () => void;
}

const [ModalProvider, useModal] = create<ModalContextValue>((setState) => ({
    isOpen: false,
    component: null,
    props: undefined,
    showModal: (component: React.ReactNode, props?: ModalProps) =>
        setState({ isOpen: true, component, props }),
    hideModal: () => setState({ isOpen: false, component: null, props: undefined }),
}));

export { ModalProvider, useModal };
