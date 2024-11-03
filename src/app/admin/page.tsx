'use client';
import MainAdmin from '@/components/MainAdmin';
import SideBarAdmin from '@/components/SideBarAdmin';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminPage = () => {

    const [isOpen, setIsOpen] = React.useState(true);
    const toggleSideBar = () => {
        setIsOpen(!isOpen);
    };

    return (
    <div className="flex h-screen">
        <SideBarAdmin isOpen={isOpen} toggleSideBar={toggleSideBar} />
        <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-52" : "ml-20"}`}>
            <MainAdmin />
        </div>
    </div>
  );
}

// export default AdminPage;

export default () => (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
  
