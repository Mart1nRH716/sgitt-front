// Perfil.tsx
'use client';
import React, { useState } from 'react';
import NavBarProfile from '@/components/NavBarProfile';
import SideBarProfile from '@/components/SideBarProfile';
import MainProfile from '@/components/MainProfile';

const Perfil = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <main className="m-auto">
      <div>
        <NavBarProfile toggleSidebar={toggleSidebar} />
        <SideBarProfile isCollapsed={isSidebarCollapsed} />
        <MainProfile isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </main>
  );
};

export default Perfil;