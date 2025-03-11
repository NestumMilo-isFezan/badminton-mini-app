import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Palette, Gamepad2, MapPin } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/',  // Fallback URL
        routeName: 'home',  // Named route
        icon: LayoutGrid,
        activeUrl: 'admin.dashboard|player.home|umpire.home' // Multiple routes pattern
    },
    {
        title: 'Venues',
        url: '/venues',
        routeName: 'admin.venues.index',
        icon: MapPin,
    },

];

const footerNavItems: NavItem[] = [
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: Palette,
        component: 'appearance-toggle', // Add this special flag
    },
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" className="bg-primary text-primary-foreground">
            <SidebarHeader>
                <SidebarMenu className="text-primary-foreground">
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-primary-foreground/10">
                            <Link href={route('home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems}/>
            </SidebarContent>

            <SidebarFooter className="text-primary-foreground">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
