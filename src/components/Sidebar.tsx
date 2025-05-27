
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Calendar, Heart, Thermometer, Utensils, Dumbbell, Pill, Building, Users, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Disease Management', path: '/disease-management', icon: Thermometer },
    { name: 'Preventive Healthcare', path: '/preventive-healthcare', icon: Heart },
    { name: 'Expiry Tracker', path: '/expiry-tracker', icon: Calendar },
    { name: 'Yoga & Fitness', path: '/yogafitness', icon: Dumbbell },
    { name: 'Diet Planner', path: '/diet-planner', icon: Utensils },
    { name: 'Health Tools', path: '/health-tools', icon: Pill },
    { name: 'HealthDesk AI', path: '/healthdesk-ai', icon: Activity },
    { name: 'Find Hospitals', path: '/recommend-hospital', icon: Building },
    { name: 'Healthcare Community', path: '/community', icon: Users },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background pt-16 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6 -mt-16 mb-2 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="font-bold text-xl">HealthDesk</span>
          </Link>
          <button 
            onClick={() => setOpen(false)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="overflow-y-auto h-full pb-20">
          <div className="p-4">
            <ul className="space-y-1">
              {menu.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        isActive 
                          ? "bg-primary-50 text-primary-600" 
                          : "hover:bg-muted hover:text-primary-600"
                      )}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
