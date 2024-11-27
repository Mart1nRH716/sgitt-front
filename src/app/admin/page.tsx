// src/app/admin/page.tsx

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainAdmin from '@/components/MainAdmin';
import SideBarAdmin from '@/components/SideBarAdmin';
import React from 'react';

const AdminPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        router.push('/home');
      } else {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideBarAdmin isOpen={isOpen} toggleSideBar={toggleSideBar} />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "md:ml-52" : "md:ml-20"} w-full`}>
        <MainAdmin />
      </div>
    </div>
  );
};

export default AdminPage;