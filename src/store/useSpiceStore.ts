import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Spice } from '../types';
import { mockSpicesData } from '../data/mockSpices';

interface SpiceState {
  spices: Spice[];
  addSpice: (spice: Omit<Spice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpice: (id: string, updates: Partial<Spice>) => void;
  deleteSpice: (id: string) => void;
  openSpice: (id: string, openDate: string) => void;
  updateRemaining: (id: string, amount: number) => void;
  decreaseRemaining: (id: string, percent: number) => void;
}

export const useSpiceStore = create<SpiceState>()(
  persist(
    (set) => ({
      spices: mockSpicesData,
      addSpice: (spice) =>
        set((state) => {
          const now = new Date().toISOString();
          const newSpice: Spice = {
            ...spice,
            id: `spice-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };
          return { spices: [...state.spices, newSpice] };
        }),
      updateSpice: (id, updates) =>
        set((state) => ({
          spices: state.spices.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          ),
        })),
      deleteSpice: (id) =>
        set((state) => ({
          spices: state.spices.filter((s) => s.id !== id),
        })),
      openSpice: (id, openDate) =>
        set((state) => ({
          spices: state.spices.map((s) =>
            s.id === id ? { ...s, openDate, updatedAt: new Date().toISOString() } : s
          ),
        })),
      updateRemaining: (id, amount) =>
        set((state) => ({
          spices: state.spices.map((s) =>
            s.id === id
              ? { ...s, remainingAmount: Math.max(0, Math.min(100, amount)), updatedAt: new Date().toISOString() }
              : s
          ),
        })),
      decreaseRemaining: (id, percent) =>
        set((state) => ({
          spices: state.spices.map((s) =>
            s.id === id
              ? {
                  ...s,
                  remainingAmount: Math.max(0, s.remainingAmount - percent),
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        })),
    }),
    {
      name: 'spice-rack-spices',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSpiceStore;
