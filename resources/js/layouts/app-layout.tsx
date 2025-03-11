import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { Modal } from '@/components/modal';
import { ModalProvider } from '@/hooks/use-modal';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <ModalProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <Modal />
    </ModalProvider>
);
