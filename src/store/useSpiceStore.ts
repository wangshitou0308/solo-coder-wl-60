import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Spice, InventoryLog, InventoryLogType, SpiceUnit } from '../types';
import { mockSpicesData } from '../data/mockSpices';

const unitConversion: Record<string, number> = {
  '克': 1,
  '毫升': 1,
  '个': 1,
  '片': 1,
  '小块': 1,
  '茶匙': 3,
  '汤匙': 9,
  '束': 5,
};

interface SpiceState {
  spices: Spice[];
  inventoryLogs: InventoryLog[];
  addSpice: (spice: Omit<Spice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpice: (id: string, updates: Partial<Spice>) => void;
  deleteSpice: (id: string) => void;
  openSpice: (id: string, openDate: string) => void;
  updateRemaining: (id: string, amount: number) => void;
  decreaseRemaining: (id: string, percent: number, note?: string, relatedRecordId?: string) => void;
  decreaseByAmount: (id: string, amount: number, unit: string, note?: string, relatedRecordId?: string) => number;
  restockSpice: (id: string, targetPercent: number, note?: string) => void;
  adjustInventory: (id: string, newAmount: number, note?: string) => void;
  addInventoryLog: (spiceId: string, type: InventoryLogType, amount: number, unit: string, note?: string, relatedRecordId?: string) => void;
  getSpiceLogs: (spiceId: string) => InventoryLog[];
  getRemainingAmountInUnit: (spice: Spice) => number;
  convertToPercent: (spice: Spice, amount: number, unit: string) => number;
}

const createMockLogs = (): InventoryLog[] => {
  const logs: InventoryLog[] = [];
  const now = new Date();

  mockSpicesData.forEach((spice) => {
    if (spice.openDate) {
      logs.push({
        id: `log-open-${spice.id}`,
        spiceId: spice.id,
        spiceName: spice.name,
        type: 'open',
        amount: 0,
        unit: spice.unit,
        remainingAfter: 100,
        note: '开瓶',
        createdAt: new Date(spice.openDate).toISOString(),
      });
    }

    const usedPercent = 100 - spice.remainingAmount;
    if (usedPercent > 0) {
      logs.push({
        id: `log-consume-${spice.id}`,
        spiceId: spice.id,
        spiceName: spice.name,
        type: 'consume',
        amount: Number(((usedPercent / 100) * spice.fullAmount).toFixed(1)),
        unit: spice.unit,
        remainingAfter: spice.remainingAmount,
        note: '累计消耗',
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  });

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const useSpiceStore = create<SpiceState>()(
  persist(
    (set, get) => ({
      spices: mockSpicesData,
      inventoryLogs: createMockLogs(),

      addSpice: (spice) =>
        set((state) => {
          const now = new Date().toISOString();
          const newSpice: Spice = {
            ...spice,
            id: `spice-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };
          const newLog: InventoryLog = {
            id: `log-${Date.now()}-purchase`,
            spiceId: newSpice.id,
            spiceName: newSpice.name,
            type: 'purchase',
            amount: newSpice.fullAmount,
            unit: newSpice.unit,
            remainingAfter: 100,
            note: '新购入',
            createdAt: now,
          };
          return {
            spices: [...state.spices, newSpice],
            inventoryLogs: [newLog, ...state.inventoryLogs],
          };
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
          inventoryLogs: state.inventoryLogs.filter((l) => l.spiceId !== id),
        })),

      openSpice: (id, openDate) =>
        set((state) => {
          const spice = state.spices.find((s) => s.id === id);
          const newLog: InventoryLog | null = spice
            ? {
                id: `log-${Date.now()}-open`,
                spiceId: id,
                spiceName: spice.name,
                type: 'open',
                amount: 0,
                unit: spice.unit,
                remainingAfter: spice.remainingAmount,
                note: '开瓶',
                createdAt: new Date().toISOString(),
              }
            : null;
          return {
            spices: state.spices.map((s) =>
              s.id === id ? { ...s, openDate, updatedAt: new Date().toISOString() } : s
            ),
            inventoryLogs: newLog ? [newLog, ...state.inventoryLogs] : state.inventoryLogs,
          };
        }),

      updateRemaining: (id, amount) =>
        set((state) => ({
          spices: state.spices.map((s) =>
            s.id === id
              ? { ...s, remainingAmount: Math.max(0, Math.min(100, amount)), updatedAt: new Date().toISOString() }
              : s
          ),
        })),

      decreaseRemaining: (id, percent, note, relatedRecordId) =>
        set((state) => {
          const spice = state.spices.find((s) => s.id === id);
          if (!spice) return state;

          const newPercent = Math.max(0, spice.remainingAmount - percent);
          const actualAmount = Number(((percent / 100) * spice.fullAmount).toFixed(1));

          const newLog: InventoryLog = {
            id: `log-${Date.now()}-consume`,
            spiceId: id,
            spiceName: spice.name,
            type: 'consume',
            amount: actualAmount,
            unit: spice.unit,
            remainingAfter: newPercent,
            note,
            relatedRecordId,
            createdAt: new Date().toISOString(),
          };

          return {
            spices: state.spices.map((s) =>
              s.id === id ? { ...s, remainingAmount: newPercent, updatedAt: new Date().toISOString() } : s
            ),
            inventoryLogs: [newLog, ...state.inventoryLogs],
          };
        }),

      decreaseByAmount: (id, amount, unit, note, relatedRecordId) => {
        const spice = get().spices.find((s) => s.id === id);
        if (!spice) return 0;

        const baseAmount = amount * (unitConversion[unit] || 1);
        const baseFull = spice.fullAmount * (unitConversion[spice.unit] || 1);
        const percent = (baseAmount / baseFull) * 100;

        get().decreaseRemaining(id, percent, note, relatedRecordId);
        return percent;
      },

      restockSpice: (id, targetPercent, note) =>
        set((state) => {
          const spice = state.spices.find((s) => s.id === id);
          if (!spice) return state;

          const target = Math.max(0, Math.min(100, targetPercent));
          const addedPercent = target - spice.remainingAmount;
          const addedAmount = Number(((addedPercent / 100) * spice.fullAmount).toFixed(1));

          const newLog: InventoryLog = {
            id: `log-${Date.now()}-restock`,
            spiceId: id,
            spiceName: spice.name,
            type: 'restock',
            amount: addedAmount,
            unit: spice.unit,
            remainingAfter: target,
            note: note || '补货',
            createdAt: new Date().toISOString(),
          };

          return {
            spices: state.spices.map((s) =>
              s.id === id ? { ...s, remainingAmount: target, updatedAt: new Date().toISOString() } : s
            ),
            inventoryLogs: [newLog, ...state.inventoryLogs],
          };
        }),

      adjustInventory: (id, newAmount, note) =>
        set((state) => {
          const spice = state.spices.find((s) => s.id === id);
          if (!spice) return state;

          const target = Math.max(0, Math.min(100, newAmount));
          const diff = target - spice.remainingAmount;
          const diffAmount = Number(((diff / 100) * spice.fullAmount).toFixed(1));

          const newLog: InventoryLog = {
            id: `log-${Date.now()}-adjust`,
            spiceId: id,
            spiceName: spice.name,
            type: 'adjust',
            amount: diffAmount,
            unit: spice.unit,
            remainingAfter: target,
            note: note || '手动调整',
            createdAt: new Date().toISOString(),
          };

          return {
            spices: state.spices.map((s) =>
              s.id === id ? { ...s, remainingAmount: target, updatedAt: new Date().toISOString() } : s
            ),
            inventoryLogs: [newLog, ...state.inventoryLogs],
          };
        }),

      addInventoryLog: (spiceId, type, amount, unit, note, relatedRecordId) =>
        set((state) => {
          const spice = state.spices.find((s) => s.id === spiceId);
          if (!spice) return state;

          const newLog: InventoryLog = {
            id: `log-${Date.now()}`,
            spiceId,
            spiceName: spice.name,
            type,
            amount,
            unit,
            remainingAfter: spice.remainingAmount,
            note,
            relatedRecordId,
            createdAt: new Date().toISOString(),
          };

          return {
            inventoryLogs: [newLog, ...state.inventoryLogs],
          };
        }),

      getSpiceLogs: (spiceId) => {
        return get()
          .inventoryLogs.filter((l) => l.spiceId === spiceId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getRemainingAmountInUnit: (spice) => {
        return Number(((spice.remainingAmount / 100) * spice.fullAmount).toFixed(1));
      },

      convertToPercent: (spice, amount, unit) => {
        const baseAmount = amount * (unitConversion[unit] || 1);
        const baseFull = spice.fullAmount * (unitConversion[spice.unit] || 1);
        return (baseAmount / baseFull) * 100;
      },
    }),
    {
      name: 'spice-rack-spices',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        spices: state.spices,
        inventoryLogs: state.inventoryLogs,
      }),
    }
  )
);

export default useSpiceStore;
