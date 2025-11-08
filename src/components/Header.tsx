import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuth } from '@/lib/auth';
import { NotificationBell } from './NotificationBell';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/signin');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Smart Grocery Tracker</h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/dashboard">
            <Button 
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/inventory">
            <Button 
              variant={isActive('/inventory') ? 'default' : 'ghost'}
              size="sm"
            >
              Inventory
            </Button>
          </Link>
          <Link to="/analytics">
            <Button 
              variant={isActive('/analytics') ? 'default' : 'ghost'}
              size="sm"
            >
              Analytics
            </Button>
          </Link>
          <Link to="/notifications">
            <Button 
              variant={isActive('/notifications') ? 'default' : 'ghost'}
              size="sm"
            >
              Notifications
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex md:hidden items-center gap-1 px-4 pb-3 overflow-x-auto">
        <Link to="/dashboard">
          <Button 
            variant={isActive('/dashboard') ? 'default' : 'ghost'}
            size="sm"
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/inventory">
          <Button 
            variant={isActive('/inventory') ? 'default' : 'ghost'}
            size="sm"
          >
            Inventory
          </Button>
        </Link>
        <Link to="/analytics">
          <Button 
            variant={isActive('/analytics') ? 'default' : 'ghost'}
            size="sm"
          >
            Analytics
          </Button>
        </Link>
        <Link to="/notifications">
          <Button 
            variant={isActive('/notifications') ? 'default' : 'ghost'}
            size="sm"
          >
            Notifications
          </Button>
        </Link>
      </nav>
    </header>
  );
};
