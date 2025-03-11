import * as React from 'react';

export function create<T>(createState: (setState: (state: Partial<T>) => void) => T) {
    const Context = React.createContext<T | null>(null);

    function Provider({ children }: { children: React.ReactNode }) {
        const [state, setState] = React.useState(() => {
            return createState((newState) => {
                setState((prev) => ({ ...prev, ...newState }));
            });
        });

        return React.createElement(Context.Provider, { value: state }, children);
    }

    function useContext() {
        const context = React.useContext(Context);
        if (!context) {
            throw new Error('useContext must be used within its provider!');
        }
        return context;
    }

    return [Provider, useContext] as const;
}
