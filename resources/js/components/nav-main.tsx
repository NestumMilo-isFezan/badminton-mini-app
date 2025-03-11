import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();

    const isItemActive = (item: NavItem) => {
        // Check explicit isActive flag first
        if (item.isActive !== undefined) {
            return item.isActive;
        }

        // If activeUrl is specified, use it for route checking
        if (item.activeUrl) {
            return route().current(item.activeUrl);
        }

        // For items with route names, check current route
        if (item.routeName) {
            return route().current(item.routeName);
        }

        // Fallback to URL path matching
        return page.url.startsWith(item.url);
    };

    const getItemHref = (item: NavItem) => {
        // If routeName is provided, use route()
        if (item.routeName) {
            return route(item.routeName);
        }
        // Fallback to direct URL
        return item.url;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isItemActive(item)}>
                            <Link href={getItemHref(item)} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
