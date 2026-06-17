import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CookingRecord, SpiceUsage } from '../types';

const mockUsages1: SpiceUsage[] = [
  { spiceId: 'spice-001', spiceName: '黑胡椒', amount: 2, unit: '克' },
  { spiceId: 'spice-006', spiceName: '百里香', amount: 1, unit: '克' },
];
const mockUsages2: SpiceUsage[] = [
  { spiceId: 'spice-002', spiceName: '迷迭香', amount: 3, unit: '克' },
  { spiceId: 'spice-001', spiceName: '黑胡椒', amount: 1, unit: '克' },
];
const mockUsages3: SpiceUsage[] = [
  { spiceId: 'spice-003', spiceName: '孜然', amount: 5, unit: '克' },
  { spiceId: 'spice-007', spiceName: '辣椒粉', amount: 3, unit: '克' },
  { spiceId: 'spice-001', spiceName: '黑胡椒', amount: 1, unit: '克' },
];
const mockUsages4: SpiceUsage[] = [
  { spiceId: 'spice-004', spiceName: '罗勒', amount: 2, unit: '克' },
  { spiceId: 'spice-005', spiceName: '牛至', amount: 1.5, unit: '克' },
  { spiceId: 'spice-001', spiceName: '黑胡椒', amount: 1, unit: '克' },
];
const mockUsages5: SpiceUsage[] = [
  { spiceId: 'spice-012', spiceName: '姜黄', amount: 4, unit: '克' },
  { spiceId: 'spice-009', spiceName: '八角', amount: 2, unit: '个' },
  { spiceId: 'spice-010', spiceName: '桂皮', amount: 1, unit: '小块' },
  { spiceId: 'spice-011', spiceName: '香叶', amount: 2, unit: '片' },
  { spiceId: 'spice-001', spiceName: '黑胡椒', amount: 1, unit: '克' },
];
const mockUsages6: SpiceUsage[] = [
  { spiceId: 'spice-007', spiceName: '辣椒粉', amount: 3, unit: '克' },
  { spiceId: 'spice-008', spiceName: '花椒', amount: 2, unit: '克' },
  { spiceId: 'spice-003', spiceName: '孜然', amount: 1, unit: '克' },
];

const mockRecords: CookingRecord[] = [
  {
    id: 'record-001',
    dishName: '黑椒牛排',
    cookDate: '2026-06-15',
    ingredients: ['牛排', '黄油', '大蒜'],
    usages: mockUsages1,
    flavorRating: 5,
    notes: '用现磨黑胡椒，风味十足',
    createdAt: '2026-06-15T20:00:00.000Z',
  },
  {
    id: 'record-002',
    dishName: '烤土豆迷迭香',
    cookDate: '2026-06-10',
    ingredients: ['土豆', '橄榄油'],
    usages: mockUsages2,
    flavorRating: 4,
    createdAt: '2026-06-10T18:30:00.000Z',
  },
  {
    id: 'record-003',
    dishName: '孜然羊肉串',
    cookDate: '2026-06-05',
    ingredients: ['羊肉', '洋葱'],
    usages: mockUsages3,
    flavorRating: 5,
    notes: '夜宵必备，下次多放点孜然',
    createdAt: '2026-06-05T22:00:00.000Z',
  },
  {
    id: 'record-004',
    dishName: '意式番茄意面',
    cookDate: '2026-05-28',
    ingredients: ['意大利面', '番茄', '橄榄油', '帕玛森芝士'],
    usages: mockUsages4,
    flavorRating: 4,
    createdAt: '2026-05-28T19:00:00.000Z',
  },
  {
    id: 'record-005',
    dishName: '咖喱鸡',
    cookDate: '2026-05-20',
    ingredients: ['鸡肉', '土豆', '胡萝卜', '椰浆'],
    usages: mockUsages5,
    flavorRating: 5,
    notes: '家庭版印度咖喱，香料搭配很成功',
    createdAt: '2026-05-20T20:30:00.000Z',
  },
  {
    id: 'record-006',
    dishName: '麻婆豆腐',
    cookDate: '2026-04-15',
    ingredients: ['嫩豆腐', '牛肉末', '豆瓣酱'],
    usages: mockUsages6,
    flavorRating: 4,
    createdAt: '2026-04-15T18:00:00.000Z',
  },
];

interface RecordState {
  records: CookingRecord[];
  addRecord: (record: Omit<CookingRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  getSpiceUsageHistory: (spiceId: string) => CookingRecord[];
  calculateTopSpices: (timeRange: 'month' | 'quarter' | 'year') => [string, string, number][];
  calculateTopPairings: (timeRange: 'month' | 'quarter' | 'year') => [string, number][];
}

const filterByTimeRange = (records: CookingRecord[], timeRange: 'month' | 'quarter' | 'year') => {
  const now = new Date();
  const startDate = new Date();
  switch (timeRange) {
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  return records.filter((r) => new Date(r.cookDate) >= startDate);
};

export const useRecordStore = create<RecordState>()(
  persist(
    (set, get) => ({
      records: mockRecords,
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            { ...record, id: `record-${Date.now()}`, createdAt: new Date().toISOString() },
          ],
        })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      getSpiceUsageHistory: (spiceId) =>
        get()
          .records.filter((r) => r.usages.some((u) => u.spiceId === spiceId))
          .sort((a, b) => new Date(b.cookDate).getTime() - new Date(a.cookDate).getTime()),
      calculateTopSpices: (timeRange) => {
        const filtered = filterByTimeRange(get().records, timeRange);
        const countMap = new Map<string, { name: string; count: number }>();
        filtered.forEach((r) => {
          r.usages.forEach((u) => {
            const existing = countMap.get(u.spiceId);
            if (existing) {
              existing.count += 1;
            } else {
              countMap.set(u.spiceId, { name: u.spiceName, count: 1 });
            }
          });
        });
        return Array.from(countMap.entries())
          .map(([id, data]) => [id, data.name, data.count] as [string, string, number])
          .sort((a, b) => b[2] - a[2])
          .slice(0, 10);
      },
      calculateTopPairings: (timeRange) => {
        const filtered = filterByTimeRange(get().records, timeRange);
        const countMap = new Map<string, number>();
        filtered.forEach((r) => {
          const names = r.usages.map((u) => u.spiceName).sort();
          for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
              const pair = `${names[i]} + ${names[j]}`;
              countMap.set(pair, (countMap.get(pair) || 0) + 1);
            }
          }
        });
        return Array.from(countMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
      },
    }),
    {
      name: 'spice-rack-records',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecordStore;
