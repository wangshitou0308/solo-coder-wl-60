import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar, { type MenuKey } from './Sidebar';
import Topbar from './Topbar';
import { SearchProvider } from '@/contexts/SearchContext';

const MENU_TO_ROUTE: Record<MenuKey, string> = {
  dashboard: '/',
  'spice-cabinet': '/spice-rack',
  'flavor-knowledge': '/knowledge',
  'usage-records': '/records',
  'shopping-list': '/shopping',
  'creative-inspiration': '/inspiration',
};

const ROUTE_TO_MENU: Record<string, MenuKey> = {
  '/': 'dashboard',
  '/spice-rack': 'spice-cabinet',
  '/knowledge': 'flavor-knowledge',
  '/records': 'usage-records',
  '/shopping': 'shopping-list',
  '/inspiration': 'creative-inspiration',
};

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu: MenuKey = ROUTE_TO_MENU[location.pathname] || 'dashboard';

  const handleMenuChange = useCallback(
    (key: MenuKey) => {
      const route = MENU_TO_ROUTE[key];
      if (route && route !== location.pathname) {
        navigate(route);
      }
    },
    [navigate, location.pathname]
  );

  return (
    <SearchProvider>
      <div className={cn('flex min-h-screen bg-spice-cream', className)}>
        <Sidebar activeKey={activeMenu} onMenuClick={handleMenuChange} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SearchProvider>
  );
}
