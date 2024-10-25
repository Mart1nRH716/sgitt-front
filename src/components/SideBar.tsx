'use client';
import React,  { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const [userType, setUserType] = useState('Usuario');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserType(localStorage.getItem('user-Type') || 'Usuario');
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home' ? 'active' : '';
    }
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className={`fixed top-[64px] transition-all overflow-hidden left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-secondary border-r bottom-0 z-40`} id='sidebar'>
      <Link href="/perfil" className='p-4 flex items-center gap-4 hover:bg-help3'>
        <img
          src="/api/placeholder/64/64"
          className='w-16 aspect-square object-cover rounded'
          alt="Perfil"
        />
        {!isCollapsed && (
          <div className='whitespace-nowrap sidebar-user-profile'>
            <h3 className='text-lg font-semibold mb-2'>Mi Perfil</h3>
            <span className='py-1 px-2 rounded-full bg-primary text-white text-sm font-medium'>
            {userType}
            </span>
          </div>
        )}
      </Link>

      <div className='py-4'>
        <span className={`text-sm text-gray-500 uppercase ml-4 inline-block mb-2 ${isCollapsed ? 'hidden' : ''}`}>Menú</span>
        <ul className="sidebar-menu">
          <li>
            <Link href="/home" className={isActive('/home')}>
              <FaHome className='sidebar-menu-icon' /> {!isCollapsed && 'Inicio'}
            </Link>
          </li>
          <li>
            <Link href="/perfil" className={isActive('/perfil')}>
              <FaUser className='sidebar-menu-icon' /> {!isCollapsed && 'Mi Perfil'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/mispropuestas" className={isActive('/perfil/mispropuestas')}>
              <IoMdPaper className='sidebar-menu-icon' /> {!isCollapsed && 'Mis Propuestas'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/guardados" className={isActive('/perfil/guardados')}>
              <FaBookmark className='sidebar-menu-icon' /> {!isCollapsed && 'Guardados'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/configuracion" className={isActive('/perfil/configuracion')}>
              <GoGear className='sidebar-menu-icon' /> {!isCollapsed && 'Configuración'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/ayuda" className={isActive('/perfil/ayuda')}>
              <AiOutlineQuestionCircle className='sidebar-menu-icon' /> {!isCollapsed && 'Ayuda'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;