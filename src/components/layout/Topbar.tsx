import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ExternalLink, ChefHat, BookOpen, Package, ClipboardList, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch, type SearchResultType } from '@/contexts/SearchContext';

const typeMeta: Record<SearchResultType, { icon: typeof Package; label: string; color: string }> = {
  spice: { icon: Package, label: '香料', color: 'text-spice-sage bg-spice-sage/10' },
  knowledge: { icon: BookOpen, label: '知识', color: 'text-spice-brown bg-spice-brown/10' },
  pairing: { icon: Sparkles, label: '搭配', color: 'text-spice-saffron bg-spice-saffron/10' },
  record: { icon: ChefHat, label: '记录', color: 'text-blue-600 bg-blue-50' },
  recipe: { icon: ClipboardList, label: '配方', color: 'text-purple-600 bg-purple-50' },
};

export default function Topbar() {
  const { query, setQuery, results, isSearching, clearSearch } = useSearch();
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (route: string) => {
    navigate(route);
    clearSearch();
    setFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-spice-creamDark bg-spice-cream/95 px-6 backdrop-blur-sm">
      <div className="hidden w-10 md:block" />

      <div className="flex max-w-2xl flex-1 items-center" ref={wrapRef}>
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-spice-brown/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="搜索香料、配方、风味搭配、烹饪记录..."
            className="w-full rounded-full border border-spice-creamDark bg-white py-2.5 pl-10 pr-10 text-sm text-spice-charcoal placeholder:text-spice-brown/50 focus:border-spice-sage focus:outline-none focus:ring-2 focus:ring-spice-sage/20 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => clearSearch()}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-spice-brown/50 transition-colors hover:bg-spice-creamDark hover:text-spice-charcoal"
              aria-label="清除搜索"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* 搜索结果下拉 */}
          {(isSearching || focused) && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-xl border border-spice-creamDark bg-white shadow-xl ring-1 ring-black/5 animate-fade-in-up">
              {!isSearching && focused ? (
                <div className="px-5 py-6 text-center">
                  <Search className="mx-auto mb-2 h-6 w-6 text-spice-brown/40" />
                  <p className="text-sm text-spice-brown/60">输入关键词开始搜索香料、配方、记录...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-sm text-spice-brown/60">
                    没有找到与 "<span className="font-medium text-spice-charcoal">{query}</span>" 相关的结果
                  </p>
                </div>
              ) : (
                <ul className="max-h-[420px] overflow-y-auto py-2">
                  {results.map((item) => {
                    const meta = typeMeta[item.type];
                    const Icon = meta.icon;
                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <button
                          type="button"
                          onClick={() => handleSelectResult(item.route)}
                          className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-spice-cream"
                        >
                          <span className="text-2xl leading-none">{item.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-spice-charcoal">{item.title}</p>
                              <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', meta.color)}>
                                <Icon className="h-3 w-3" />
                                {meta.label}
                              </span>
                            </div>
                            <p className="truncate text-xs text-spice-brown/70">{item.subtitle}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-spice-brown/30 transition-colors group-hover:text-spice-sage" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-spice-saffron to-spice-cinnamon text-white shadow-md transition-transform hover:scale-105"
          aria-label="用户头像"
        >
          <span className="text-sm font-semibold">香</span>
        </button>
      </div>
    </header>
  );
}
