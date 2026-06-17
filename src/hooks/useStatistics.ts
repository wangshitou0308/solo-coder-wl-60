import { useMemo } from 'react';
import useSpiceStore from '@/store/useSpiceStore';
import useRecordStore from '@/store/useRecordStore';
import { getExpiryStatus } from '@/utils/dateUtils';
import type { SpiceCategory, Spice } from '@/types';

export interface InventoryStats {
  totalCount: number;
  categoryDistribution: { category: SpiceCategory; count: number; color: string }[];
  expiringCount: number;
  lowStockCount: number;
  expiringItems: Spice[];
  lowStockItems: Spice[];
}

export interface TopSpiceItem {
  id: string;
  name: string;
  count: number;
}

export interface TopPairingItem {
  name: string;
  count: number;
}

export interface UsageStats {
  topSpices: TopSpiceItem[];
  topPairings: TopPairingItem[];
}

const CATEGORY_COLORS: Record<SpiceCategory, string> = {
  '香草类': '#7A9E7E',
  '辛香类': '#8B5E3C',
  '辣椒类': '#C1584F',
  '花香类': '#DB7093',
  '籽类': '#E8A838',
  '根茎类': '#D2691E',
  '皮类': '#A0522D',
  '叶类': '#5C7A5F',
  '混合类': '#6366F1'
};

export function useInventoryStats(): InventoryStats {
  const spices = useSpiceStore((state) => state.spices);

  return useMemo(() => {
    const totalCount = spices.length;
    const categoryMap = new Map<SpiceCategory, number>();
    let expiringCount = 0;
    let lowStockCount = 0;
    const expiringItems: Spice[] = [];
    const lowStockItems: Spice[] = [];

    spices.forEach((spice) => {
      const current = categoryMap.get(spice.category) || 0;
      categoryMap.set(spice.category, current + 1);

      const expiryResult = getExpiryStatus(spice.expiryDate, spice.openDate);
      if (expiryResult.status !== 'normal') {
        expiringCount++;
        expiringItems.push({ ...spice, _days: expiryResult.days } as Spice & { _days: number });
      }

      if (spice.remainingAmount <= spice.minThreshold) {
        lowStockCount++;
        lowStockItems.push(spice);
      }
    });

    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        color: CATEGORY_COLORS[category] || '#6b7280'
      }))
      .sort((a, b) => b.count - a.count);

    expiringItems.sort((a, b) => {
      const da = (getExpiryStatus(a.expiryDate, a.openDate)).days;
      const db = (getExpiryStatus(b.expiryDate, b.openDate)).days;
      return da - db;
    });

    return {
      totalCount,
      categoryDistribution,
      expiringCount,
      lowStockCount,
      expiringItems,
      lowStockItems,
    };
  }, [spices]);
}

export function useUsageStats(): UsageStats {
  const spices = useSpiceStore((state) => state.spices);
  const calculateTopSpices = useRecordStore((state) => state.calculateTopSpices);
  const calculateTopPairings = useRecordStore((state) => state.calculateTopPairings);

  return useMemo(() => {
    const spiceMap = new Map(spices.map((s) => [s.id, s.name]));

    // 返回是 [id, name, count]
    const rawTopSpices = calculateTopSpices('month');
    const topSpices: TopSpiceItem[] = rawTopSpices
      .map(([id, name, count]) => ({
        id,
        name: name || spiceMap.get(id) || id,
        count,
      }))
      .slice(0, 10);

    // 返回是 ["香料A + 香料B", count]
    const rawTopPairings = calculateTopPairings('month');
    const topPairings: TopPairingItem[] = rawTopPairings
      .map(([name, count]) => ({ name, count }))
      .slice(0, 5);

    return {
      topSpices,
      topPairings,
    };
  }, [spices, calculateTopSpices, calculateTopPairings]);
}

export function useSpiceById(id?: string): Spice | undefined {
  const spices = useSpiceStore((state) => state.spices);
  return useMemo(() => spices.find((s) => s.id === id), [spices, id]);
}
