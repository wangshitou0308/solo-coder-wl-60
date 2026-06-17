import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuToggle?: () => void;
  className?: string;
}

export default function Topbar({ onMenuToggle, className }: TopbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-spice-creamDark bg-spice-cream/95 px-6 backdrop-blur-sm',
        className
      )}
    >
      <button
        type="button"
        onClick={handleMobileMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-spice-charcoal transition-colors hover:bg-spice-creamDark md:hidden"
        aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="flex max-w-xl flex-1 items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-spice-brown/60" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索香料、食谱、风味搭配..."
            className="w-full rounded-full border border-spice-creamDark bg-white py-2.5 pl-10 pr-4 text-sm text-spice-charcoal placeholder:text-spice-brown/50 focus:border-spice-sage focus:outline-none focus:ring-2 focus:ring-spice-sage/20 transition-colors"
          />
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
