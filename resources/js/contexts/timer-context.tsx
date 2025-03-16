import { create } from '@/lib/create-context';
import { useCallback, useState } from 'react';

interface TimerState {
    pausedGames: Set<number>;
    isPaused: (gameId: number) => boolean;
    toggleTimer: (gameId: number) => void;
}

const [TimerProvider, useTimer] = create<TimerState>((setState) => {
    // Create pausedGames set outside of useState to avoid initialization issues
    const pausedGames = new Set<number>();

    const isPaused = useCallback((gameId: number) => {
        return pausedGames.has(gameId);
    }, []);

    const toggleTimer = useCallback((gameId: number) => {
        if (pausedGames.has(gameId)) {
            pausedGames.delete(gameId);
        } else {
            pausedGames.add(gameId);
        }
        // Create a new Set to trigger state update
        setState({ pausedGames: new Set(pausedGames) });
    }, []);

    return {
        pausedGames,
        isPaused,
        toggleTimer,
    };
});

export { TimerProvider, useTimer };
