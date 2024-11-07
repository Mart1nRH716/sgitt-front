'use client';
import React, { useState , useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './SideBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <main className={`
        transition-all 
        duration-300 
        pt-16
        ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
        ml-0
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>
      
      <div className={`
        transition-all 
        duration-300
        ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
        ml-0
      `}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;