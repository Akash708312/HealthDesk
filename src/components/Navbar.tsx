
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="font-bold text-xl">HealthDesk</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="transition-colors hover:text-primary-600">Dashboard</Link>
          <Link to="/healthdesk-ai" className="transition-colors hover:text-primary-600">HealthDesk AI</Link>
          <Link to="/recommend-hospital" className="transition-colors hover:text-primary-600">Find Hospitals</Link>
          <Link to="/community" className="transition-colors hover:text-primary-600">Community</Link>
          <Link to="/health-tools" className="transition-colors hover:text-primary-600">Health Tools</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-600"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                  <Button variant="ghost" size="sm">Mark all as read</Button>
                </div>
                <div className="py-2">
                  <DropdownMenuItem className="p-4 cursor-pointer">
                    <div>
                      <p className="font-medium">Medication reminder</p>
                      <p className="text-sm text-muted-foreground">It's time to take your evening medication</p>
                      <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 cursor-pointer">
                    <div>
                      <p className="font-medium">Doctor's appointment</p>
                      <p className="text-sm text-muted-foreground">Upcoming appointment with Dr. Smith tomorrow</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium">{profile?.full_name || user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} variant="default" size="sm">
              Login
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden py-4 px-6 space-y-4 border-t bg-background absolute left-0 right-0 z-30 shadow-md">
          <Link 
            to="/dashboard" 
            className="block py-2 hover:text-primary-600"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/healthdesk-ai" 
            className="block py-2 hover:text-primary-600"
            onClick={() => setMenuOpen(false)}
          >
            HealthDesk AI
          </Link>
          <Link 
            to="/recommend-hospital" 
            className="block py-2 hover:text-primary-600"
            onClick={() => setMenuOpen(false)}
          >
            Find Hospitals
          </Link>
          <Link 
            to="/community" 
            className="block py-2 hover:text-primary-600"
            onClick={() => setMenuOpen(false)}
          >
            Community
          </Link>
          <Link 
            to="/health-tools" 
            className="block py-2 hover:text-primary-600"
            onClick={() => setMenuOpen(false)}
          >
            Health Tools
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
