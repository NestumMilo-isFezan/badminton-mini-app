import { formatISO, parseISO, format } from 'date-fns';

const TIMEZONE = 'Asia/Kuala_Lumpur';

export function useDateTime() {
    // Convert UTC ISO string to local Date object
    const toLocalDate = (isoString: string | null | undefined): Date => {
        if (!isoString) return new Date();

        try {
            return parseISO(isoString);
        } catch (error) {
            console.error('Error parsing date:', error);
            return new Date();
        }
    };

    // Convert local Date object to UTC ISO string
    const toUTCString = (localDate: Date): string => {
        try {
            return formatISO(localDate);
        } catch (error) {
            console.error('Error formatting date:', error);
            return new Date().toISOString();
        }
    };

    // Format date for display in local timezone
    const formatLocalDate = (date: Date, formatStr: string = 'yyyy-MM-dd HH:mm'): string => {
        try {
            return format(date, formatStr, { timeZone: TIMEZONE });
        } catch (error) {
            console.error('Error formatting local date:', error);
            return date.toLocaleString();
        }
    };

    return {
        toLocalDate,
        toUTCString,
        formatLocalDate,
        TIMEZONE,
    };
}
