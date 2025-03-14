import { useEffect, useState, useRef } from 'react';
import { useDateTime } from '@/hooks/use-date-time';

interface TimerProps {
    startTime: string | null;
    isRunning: boolean;
    onTick?: (duration: string) => void;
}

export function Timer({ startTime, isRunning, onTick }: TimerProps) {
    const [elapsed, setElapsed] = useState<string>("00:00:00");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toLocalDate } = useDateTime();

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Only start if we have a start time and isRunning is true
        if (startTime && isRunning) {
            const startDate = toLocalDate(startTime);

            intervalRef.current = setInterval(() => {
                const now = new Date();
                const diffMs = now.getTime() - startDate.getTime();

                const hours = Math.floor(diffMs / 3600000);
                const minutes = Math.floor((diffMs % 3600000) / 60000);
                const seconds = Math.floor((diffMs % 60000) / 1000);

                const formattedTime = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                setElapsed(formattedTime);
                onTick?.(formattedTime);
            }, 1000);
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [startTime, isRunning]);

    return <div className="text-4xl font-mono">{elapsed}</div>;
}
