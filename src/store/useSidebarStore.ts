import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarVisibility = 'visible' | 'collapsed' | 'hidden';

interface SidebarState {
    visibility: SidebarVisibility;
    setVisibility: (visibility: SidebarVisibility) => void;
    toggleSidebar: () => void;
    hideSidebar: () => void;
    showSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set, get) => ({
            visibility: 'visible',

            setVisibility: (visibility) => set({ visibility }),

            toggleSidebar: () => {
                const current = get().visibility;
                if (current === 'visible') {
                    set({ visibility: 'collapsed' });
                } else if (current === 'collapsed') {
                    set({ visibility: 'visible' });
                }
            },

            hideSidebar: () => set({ visibility: 'hidden' }),

            showSidebar: () => set({ visibility: 'visible' }),
        }),
        {
            name: 'sidebar-visibility',
        }
    )
);
