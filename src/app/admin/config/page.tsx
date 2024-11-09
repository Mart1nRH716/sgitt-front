'use client';
import React from 'react';
import SideBarAdmin from '@/components/SideBarAdmin';
import AdminConfig from '@/components/AdminConfig';

const ConfigPage = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <SideBarAdmin isOpen={isOpen} toggleSideBar={toggleSideBar} />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-52" : "ml-20"}`}>
        <AdminConfig />
      </div>
    </div>
  );
};

export default ConfigPage;