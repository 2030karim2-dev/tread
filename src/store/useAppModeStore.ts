import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppMode = 'normal' | 'market';

interface AppModeState {
    mode: AppMode;
    isMarketMode: boolean;
    toggleMarketMode: () => void;
    setMode: (mode: AppMode) => void;
}

export const useAppModeStore = create<AppModeState>()(
    persist(
        (set) => ({
            mode: 'normal',
            isMarketMode: false,

            toggleMarketMode: () => set((state) => {
                const newMode = state.mode === 'normal' ? 'market' : 'normal';
                return {
                    mode: newMode,
                    isMarketMode: newMode === 'market'
                };
            }),

            setMode: (mode) => set({
                mode,
                isMarketMode: mode === 'market'
            }),
        }),
        {
            name: 'trade-navigator-mode',
        }
    )
);
