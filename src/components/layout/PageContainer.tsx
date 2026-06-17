import { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import type { MenuKey } from './Sidebar';

interface PageContainerProps {
  activeMenu?: MenuKey;
  onMenuChange?: (key: MenuKey) => void;
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  activeMenu,
  onMenuChange,
  children,
  className,
}: PageContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={cn('flex min-h-screen bg-spice-cream', className)}>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'block' : 'hidden md:block'
        )}
      >
        <Sidebar activeKey={activeMenu} onMenuClick={onMenuChange} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={handleMenuToggle} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
