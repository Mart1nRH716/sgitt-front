'use client';
import React from 'react';
import MainAdmin from '@/components/MainAdmin';
import SideBarAdmin from '@/components/SideBarAdmin';

const AdminPage = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [currentTab, setCurrentTab] = React.useState<string | null>(null);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabSelect = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div className="flex h-screen">
      <SideBarAdmin 
        isOpen={isOpen} 
        toggleSideBar={toggleSideBar} 
        onSelectTab={handleTabSelect}
      />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-52" : "ml-20"}`}>
        <MainAdmin />
      </div>
    </div>
  );
}

export default AdminPage;