'use client';
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './SideBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
        <div className="p-6">
          {children}
        </div>
      </main>
      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;