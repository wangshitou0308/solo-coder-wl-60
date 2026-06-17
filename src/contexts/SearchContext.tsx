import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import useSpiceStore from '@/store/useSpiceStore';
import useRecordStore from '@/store/useRecordStore';
import useRecipeStore from '@/store/useRecipeStore';
import { flavorKnowledgeData } from '@/data/flavorKnowledge';
import { classicPairingsData } from '@/data/classicPairings';
import { generateSpiceEmoji } from '@/utils/spiceUtils';

export type SearchResultType = 'spice' | 'knowledge' | 'pairing' | 'record' | 'recipe';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  emoji: string;
  route: string;
}

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const spices = useSpiceStore((s) => s.spices);
  const records = useRecordStore((s) => s.records);
  const recipes = useRecipeStore((s) => s.recipes);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: SearchResult[] = [];

    // 搜索香料库存
    spices.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.storageLocation.toLowerCase().includes(q)
      ) {
        matches.push({
          id: s.id,
          type: 'spice',
          title: s.name,
          subtitle: `${s.category} · ${s.brand} · ${s.remainingAmount}%`,
          emoji: generateSpiceEmoji(s.name),
          route: '/spice-rack',
        });
      }
    });

    // 搜索风味知识
    flavorKnowledgeData.forEach((k) => {
      if (
        k.spiceName.toLowerCase().includes(q) ||
        k.flavorProfile.toLowerCase().includes(q) ||
        k.commonUses.some((u) => u.toLowerCase().includes(q)) ||
        k.compatibleIngredients.some((i) => i.toLowerCase().includes(q))
      ) {
        matches.push({
          id: k.id,
          type: 'knowledge',
          title: k.spiceName,
          subtitle: `风味知识 · ${k.flavorProfile.slice(0, 30)}${k.flavorProfile.length > 30 ? '...' : ''}`,
          emoji: generateSpiceEmoji(k.spiceName),
          route: '/knowledge?tab=encyclopedia',
        });
      }
    });

    // 搜索经典搭配
    classicPairingsData.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.targetIngredient.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.spices.some((s) => s.name.toLowerCase().includes(q))
      ) {
        matches.push({
          id: p.id,
          type: 'pairing',
          title: p.name,
          subtitle: `经典搭配 · ${p.targetIngredient} · ${p.cuisineType}`,
          emoji: '🍽️',
          route: '/knowledge?tab=pairings',
        });
      }
    });

    // 搜索烹饪记录
    records.forEach((r) => {
      if (
        r.dishName.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q)) ||
        r.usages.some((u) => u.spiceName.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      ) {
        matches.push({
          id: r.id,
          type: 'record',
          title: r.dishName,
          subtitle: `烹饪记录 · ${r.cookDate} · ${'⭐'.repeat(r.flavorRating)}`,
          emoji: '👨‍🍳',
          route: '/records?tab=records',
        });
      }
    });

    // 搜索自定义配方
    recipes.forEach((r) => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.suitableDishes.some((d) => d.toLowerCase().includes(q)) ||
        r.components.some((c) => c.spiceName.toLowerCase().includes(q))
      ) {
        matches.push({
          id: r.id,
          type: 'recipe',
          title: r.name,
          subtitle: `自定义配方 · ${r.suitableDishes.slice(0, 2).join('、')}`,
          emoji: '📖',
          route: '/records?tab=recipes',
        });
      }
    });

    return matches.slice(0, 10);
  }, [query, spices, records, recipes]);

  const isSearching = query.trim().length > 0;

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const value: SearchContextValue = {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}
