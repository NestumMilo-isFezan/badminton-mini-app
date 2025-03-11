import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

interface AppearanceToggleDropdownProps {
    showText?: boolean;
}

export default function AppearanceToggleDropdown({ showText = false }: AppearanceToggleDropdownProps) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'light':
                return <Sun className="h-5 w-5 text-current" />;
            case 'dark':
                return <Moon className="h-5 w-5 text-current" />;
            default:
                return <Monitor className="h-5 w-5 text-current" />;
        }
    };

    const getCurrentText = () => {
        switch (appearance) {
            case 'light':
                return 'Light Mode';
            case 'dark':
                return 'Dark Mode';
            default:
                return 'System Theme';
        }
    };

    if (showText) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 group-data-[collapsible=icon]:hidden">
                        {getCurrentIcon()}
                        <span>{getCurrentText()}</span>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="bg-primary text-primary-foreground border-primary-foreground/20"
                    align="end"
                >
                    <DropdownMenuItem
                        onClick={() => updateAppearance('light')}
                        className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-current" />
                            Light Mode
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => updateAppearance('dark')}
                        className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <Moon className="h-5 w-5 text-current" />
                            Dark Mode
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => updateAppearance('system')}
                        className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-current" />
                            System Theme
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Original icon-only version
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                    {getCurrentIcon()}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-primary text-primary-foreground border-primary-foreground/20"
                align="end"
            >
                <DropdownMenuItem
                    onClick={() => updateAppearance('light')}
                    className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                >
                    <span className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-current" />
                        Light Mode
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('dark')}
                    className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                >
                    <span className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-current" />
                        Dark Mode
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('system')}
                    className="focus:bg-primary-foreground/10 focus:text-primary-foreground"
                >
                    <span className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-current" />
                        System Theme
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
