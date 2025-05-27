
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactInfo from '@/components/ContactInfo';
import FloatingContactButton from '@/components/FloatingContactButton';
import Sidebar from '@/components/Sidebar';

type PageLayoutProps = {
  children: React.ReactNode;
  showContact?: boolean;
  showSidebar?: boolean;
};

const PageLayout = ({ children, showContact = true, showSidebar = true }: PageLayoutProps) => {
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
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex flex-1 pt-16"> {/* Add top padding to account for fixed navbar */}
        {showSidebar && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        <main className={`flex-1 transition-all duration-300 ${showSidebar && sidebarOpen ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
      {showContact && <ContactInfo />}
      <Footer className={`transition-all duration-300 ${showSidebar && sidebarOpen ? 'lg:ml-64' : ''}`} />
      {showContact && <FloatingContactButton />}
    </div>
  );
};

export default PageLayout;
