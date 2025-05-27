
import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = true }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if screen is large on component mount
  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    setSidebarOpen(isLargeScreen);
    
    // Add listener for screen size changes
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        setSidebarOpen(false);
      }
    };
    
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  
  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for navbar height */}
        {showSidebar && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${showSidebar && sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer className={`transition-all duration-300 ${showSidebar && sidebarOpen ? 'lg:ml-64' : ''}`} />
    </div>
  );
};

export default MainLayout;
