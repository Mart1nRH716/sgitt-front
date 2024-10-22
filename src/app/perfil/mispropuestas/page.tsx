'use client';

import React, { useState } from 'react';
import NavBarProfile from '@/components/NavBarProfile';
import SideBarProfile from '@/components/SideBarProfile';
import MisPropuestas from '@/components/MisPropuestas';
import NabVar from '@/components/NabVar';

const MisPropuestasPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <main className="m-auto">
      <div>
        <NabVar />
        <SideBarProfile isCollapsed={isSidebarCollapsed} />
        <MisPropuestas isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </main>
  );
};

export default MisPropuestasPage;