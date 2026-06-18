import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ShoppingItem, ShoppingPriority, Spice } from '../types';
import { useSpiceStore } from './useSpiceStore';
import { useRecordStore } from './useRecordStore';

type GroupBy = 'priority' | 'category' | 'brand' | 'storageLocation';

interface ShoppingState {
  items: ShoppingItem[];
  groupBy: GroupBy;
  addItem: (spiceId: string, reason?: string) => void;
  addItemByName: (spiceName: string, category?: string, reason?: string) => void;
  removeItem: (id: string) => void;
  updateItemAmount: (id: string, amount: number) => void;
  toggleCheck: (id: string) => void;
  toggleCheckAll: () => void;
  clearChecked: () => void;
  setGroupBy: (groupBy: GroupBy) => void;
  purchaseChecked: () => void;
  refreshAutoItems: () => void;
  getSuggestedAmount: (spice: Spice) => number;
  getPriority: (spice: Spice) => ShoppingPriority;
  getGroupedItems: () => Record<string, ShoppingItem[]>;
}

const getPriorityForSpice = (spice: Spice, usageFrequency: number): ShoppingPriority => {
  if (spice.remainingAmount <= 10) return 'urgent';
  if (spice.remainingAmount <= spice.minThreshold) return 'urgent';
  if (spice.remainingAmount <= spice.minThreshold * 1.5) return 'soon';
  if (usageFrequency >= 2) return 'soon';
  return 'optional';
};

const getReasonForSpice = (spice: Spice, priority: ShoppingPriority): string => {
  if (spice.remainingAmount <= spice.minThreshold) return '低库存预警';
  if (priority === 'soon') return '库存偏低，建议近期补充';
  return '可选采购';
};

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      items: [],
      groupBy: 'priority',

      getSuggestedAmount: (spice) => {
        const usageFrequency = useRecordStore.getState().getSpiceUsageFrequency(spice.id, 30);
        const baseAmount = spice.fullAmount;

        if (spice.remainingAmount <= spice.minThreshold) {
          return Math.round(baseAmount * 1.5);
        }
        if (usageFrequency >= 3) {
          return Math.round(baseAmount * 1.2);
        }
        return baseAmount;
      },

      getPriority: (spice) => {
        const usageFrequency = useRecordStore.getState().getSpiceUsageFrequency(spice.id, 30);
        return getPriorityForSpice(spice, usageFrequency);
      },

      addItem: (spiceId, reason) => {
        const spices = useSpiceStore.getState().spices;
        const spice = spices.find((s) => s.id === spiceId);
        if (!spice) return;

        const existing = get().items.find((i) => i.spiceId === spiceId);
        if (existing) return;

        const usageFrequency = useRecordStore.getState().getSpiceUsageFrequency(spiceId, 30);
        const priority = getPriorityForSpice(spice, usageFrequency);
        const suggestedAmount = get().getSuggestedAmount(spice);
        const itemReason = reason || getReasonForSpice(spice, priority);

        const newItem: ShoppingItem = {
          id: `shop-${Date.now()}`,
          spiceId: spice.id,
          spiceName: spice.name,
          suggestedAmount,
          unit: spice.unit,
          priority,
          reason: itemReason,
          addedManually: true,
          checked: false,
          category: spice.category,
          brand: spice.brand,
          storageLocation: spice.storageLocation,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      addItemByName: (spiceName, category, reason) => {
        const spices = useSpiceStore.getState().spices;
        const existingSpice = spices.find((s) => s.name === spiceName);

        if (existingSpice) {
          get().addItem(existingSpice.id, reason);
          return;
        }

        const existingItem = get().items.find((i) => i.spiceName === spiceName);
        if (existingItem) return;

        const newItem: ShoppingItem = {
          id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          spiceId: `new-${spiceName}`,
          spiceName,
          suggestedAmount: 30,
          unit: '克',
          priority: 'optional',
          reason: reason || '创意灵感推荐补充',
          addedManually: true,
          checked: false,
          category: category as any,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateItemAmount: (id, amount) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, suggestedAmount: Math.max(0, amount) } : i
          ),
        }));
      },

      toggleCheck: (id) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, checked: !i.checked } : i
          ),
        }));
      },

      toggleCheckAll: () => {
        const { items } = get();
        const allChecked = items.every((i) => i.checked);
        set((state) => ({
          items: state.items.map((i) => ({ ...i, checked: !allChecked })),
        }));
      },

      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((i) => !i.checked),
        }));
      },

      setGroupBy: (groupBy) => {
        set({ groupBy });
      },

      purchaseChecked: () => {
        const { items } = get();
        const checkedItems = items.filter((i) => i.checked);
        const { restockSpice, addSpice, spices } = useSpiceStore.getState();

        checkedItems.forEach((item) => {
          const existingSpice = spices.find((s) => s.id === item.spiceId);
          if (existingSpice) {
            restockSpice(item.spiceId, 100, `采购入库：${item.suggestedAmount}${item.unit}`);
          } else {
            addSpice({
              name: item.spiceName,
              category: item.category || '混合类',
              form: '粉末',
              brand: item.brand || '',
              purchaseDate: new Date().toISOString().split('T')[0],
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              storageLocation: item.storageLocation || '常温柜',
              remainingAmount: 100,
              minThreshold: 20,
              fullAmount: item.suggestedAmount,
              unit: item.unit as any,
            });
          }
        });

        set((state) => ({
          items: state.items.filter((i) => !i.checked),
        }));
      },

      refreshAutoItems: () => {
        const spices = useSpiceStore.getState().spices;
        const { items } = get();
        const manualItemIds = new Set(
          items.filter((i) => i.addedManually).map((i) => i.spiceId)
        );

        const autoItems: ShoppingItem[] = [];

        spices.forEach((spice) => {
          if (manualItemIds.has(spice.id)) return;

          const usageFrequency = useRecordStore.getState().getSpiceUsageFrequency(spice.id, 30);
          const priority = getPriorityForSpice(spice, usageFrequency);

          if (priority === 'urgent' || priority === 'soon') {
            const suggestedAmount = get().getSuggestedAmount(spice);
            const reason = getReasonForSpice(spice, priority);

            autoItems.push({
              id: `auto-${spice.id}`,
              spiceId: spice.id,
              spiceName: spice.name,
              suggestedAmount,
              unit: spice.unit,
              priority,
              reason,
              addedManually: false,
              checked: false,
              category: spice.category,
              brand: spice.brand,
              storageLocation: spice.storageLocation,
              createdAt: new Date().toISOString(),
            });
          }
        });

        const manualItems = items.filter((i) => i.addedManually);
        set({ items: [...manualItems, ...autoItems] });
      },

      getGroupedItems: () => {
        const { items, groupBy } = get();
        const groups: Record<string, ShoppingItem[]> = {};

        items.forEach((item) => {
          let key: string;
          switch (groupBy) {
            case 'priority':
              key = item.priority;
              break;
            case 'category':
              key = item.category || '未分类';
              break;
            case 'brand':
              key = item.brand || '未记录品牌';
              break;
            case 'storageLocation':
              key = item.storageLocation || '未指定';
              break;
            default:
              key = '其他';
          }

          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(item);
        });

        return groups;
      },
    }),
    {
      name: 'spice-rack-shopping',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items.filter((i) => i.addedManually),
        groupBy: state.groupBy,
      }),
    }
  )
);

export default useShoppingStore;
