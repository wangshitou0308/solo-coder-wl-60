import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  ClipboardList,
  ShoppingCart,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type MenuKey =
  | 'dashboard'
  | 'spice-cabinet'
  | 'flavor-knowledge'
  | 'usage-records'
  | 'shopping-list'
  | 'creative-inspiration';

interface MenuItem {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '数据看板', icon: LayoutDashboard },
  { key: 'spice-cabinet', label: '香料柜', icon: Package },
  { key: 'flavor-knowledge', label: '风味知识库', icon: BookOpen },
  { key: 'usage-records', label: '使用记录', icon: ClipboardList },
  { key: 'shopping-list', label: '采购清单', icon: ShoppingCart },
  { key: 'creative-inspiration', label: '创意灵感', icon: Lightbulb },
];

interface SidebarProps {
  activeKey?: MenuKey;
  onMenuClick?: (key: MenuKey) => void;
  className?: string;
}

export default function Sidebar({
  activeKey = 'dashboard',
  onMenuClick,
  className,
}: SidebarProps) {
  const [hoveredKey, setHoveredKey] = useState<MenuKey | null>(null);

  return (
    <aside
      className={cn(
        'flex h-screen w-[240px] flex-col bg-spice-charcoal text-spice-cream',
        className
      )}
    >
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const isHovered = hoveredKey === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onMenuClick?.(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-200',
                isActive
                  ? 'bg-spice-sage text-white font-medium'
                  : isHovered
                    ? 'bg-spice-brown text-spice-cream'
                    : 'text-spice-cream/90 hover:bg-spice-brown'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={isActive ? 2.25 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-spice-charcoalLight p-4">
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="text-2xl">🌶️</span>
          <span className="font-display text-base font-medium text-spice-cream">
            香料灵感助手
          </span>
        </div>
      </div>
    </aside>
  );
}
