'use client';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MainProfile from '@/components/MainProfile';
import ProtectedRoute from '@/components/ProtectedRoute';

const Perfil = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <MainProfile />
      </div>
    </Layout>
  );
};

// Solo un export default, envolviendo el componente Perfil con ProtectedRoute
export default () => (
  <ProtectedRoute>
    <Perfil />
  </ProtectedRoute>
);