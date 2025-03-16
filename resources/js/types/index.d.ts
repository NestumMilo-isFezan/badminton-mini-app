import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
export * from './pagination';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    routeName?: string;  // Optional route name for Ziggy
    icon?: LucideIcon;
    isActive?: boolean;
    activeUrl?: string;
    component?: string;
}

export interface Game {
    id: number;
    name: string;
    status: string;
    type: string;
    venue: {
        id: number;
        name: string;
        image: string | null;
        address: {
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        }
    };
    court: {
        id: number;
        name: string;
    };
    player_1: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        matches: number;
        wins: number;
        losses: number;
    };
    player_2: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        matches: number;
        wins: number;
        losses: number;
    };
    start_time: string;
    end_time: string;
    scores: Array<{
        set: number;
        player_1_score: number;
        player_2_score: number;
    }>;
    winner: {
        id: number | null;
        name: string | null;
        avatar: string | null;
    };
    umpire: {
        id: number | null;
        name: string | null;
        avatar: string | null;
    };
}

export interface GameScore {
    id: number;
    name: string;
    category: string;
    status: string;
    start_time: string;
    venue: {
        id: number;
        name: string;
        image: string | null;
        address: {
            name: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        }
    };
    court: {
        id: number;
        name: string;
    };
    umpire: {
        name: string;
        avatar: string | null;
    };
    player_1: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        win: number;
        losses: number;
    };
    player_2: {
        id: number;
        name: string;
        avatar: string | null;
        win_rate: number;
        win: number;
        losses: number;
    };
    match_details: Array<{
        set: number;
        player_1_score: number;
        player_2_score: number;
        status: string;
        start_at: string;
        match_duration: number;
    }>;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name?: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
