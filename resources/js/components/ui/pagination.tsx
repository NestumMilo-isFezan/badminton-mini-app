import { cn } from '@/lib/utils';
import { type PaginationMeta } from '@/types';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    meta: PaginationMeta;
    className?: string;
}

export function Pagination({ meta, className }: PaginationProps) {
    return (
        <div className={cn("flex justify-center gap-2", className)}>
            {meta.links.map((link) => {
                if (link.url) {
                    return (
                        <Link
                            preserveScroll
                            href={link.url}
                            key={link.label}
                            className={cn(
                                'inline-block py-2 px-3 rounded-md text-xs border',
                                !link.active
                                    ? 'border-primary text-primary'
                                    : 'bg-sidebar border-primary text-sidebar-foreground'
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <span
                        key={link.label}
                        className={cn(
                            'inline-block py-2 px-3 rounded-md text-xs border',
                            !link.active
                                ? 'cursor-not-allowed bg-gray-100 border-gray-600/50 text-gray-400'
                                : 'bg-sidebar border-primary text-sidebar-foreground'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
export default Pagination;
