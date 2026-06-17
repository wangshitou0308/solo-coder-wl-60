import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'home',
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),
}));
