'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MisPropuestas from '@/components/MisPropuestas';
import ProtectedRoute from '@/components/ProtectedRoute';


const MisPropuestasPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    
    <Layout>
      <MisPropuestas />
    </Layout>
  );
};

// export default MisPropuestasPage;
export default () => (
  <ProtectedRoute>
    <MisPropuestasPage />
  </ProtectedRoute>
);
