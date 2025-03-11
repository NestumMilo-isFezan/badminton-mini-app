import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generate a full URL for an asset, similar to Laravel's asset() helper
 * @param path - The path to the asset relative to the public directory
 * @returns The full URL to the asset
 */
export function asset(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.replace(/^\//, '');

    // Get the base URL from the environment variable and add port 8000 if on localhost
    const baseUrl = import.meta.env.VITE_APP_URL || '';
    const urlWithPort = baseUrl.includes('localhost') ? `${baseUrl}:8000` : baseUrl;

    return `${urlWithPort}/storage/${cleanPath}`;
}
