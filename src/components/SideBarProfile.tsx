'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";

interface SideBarProfileProps {
  isCollapsed: boolean;
}

const SideBarProfile: React.FC<SideBarProfileProps> = ({ isCollapsed }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/perfil') {
      return pathname === '/perfil' ? 'active' : '';
    }
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className={`fixed top-[64px] transition-all overflow-hidden left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-secondary border-r bottom-0 z-40`} id='sidebar'>
      <Link href="/perfil" className='p-4 flex items-center gap-4 hover:bg-help3'>
        <img
          src="https://images.unsplash.com/photo-1726688837477-c8cbcab8e05a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
          className='w-16 aspect-square object-cover rounded'
          alt="Perfil"
        />
        {!isCollapsed && (
          <div className='whitespace-nowrap sidebar-user-profile'>
            <h3 className='text-lg font-semibold mb-2'>Nombre de Usuario</h3>
            <span className='py-1 px-2 rounded-full bg-primary text-white text-sm font-medium'>Alumno</span>
          </div>
        )}
      </Link>

      <div className='py-4'>
        <span className={`text-sm text-gray-500 uppercase ml-4 inline-block mb-2 ${isCollapsed ? 'hidden' : ''}`}>Menú</span>
        <ul className="sidebar-menu">
          <li>
            <Link href="/perfil" className={isActive('/perfil')}>
              <FaHome className='sidebar-menu-icon' /> {!isCollapsed && 'Inicio'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/mispropuestas" className={isActive('/perfil/mispropuestas')}>
              <IoMdPaper className='sidebar-menu-icon' /> {!isCollapsed && 'Mis Propuestas'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/vermastardes">
              <FaBookmark className='sidebar-menu-icon' /> {!isCollapsed && 'Ver Más Tarde'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/configuracion">
              <GoGear className='sidebar-menu-icon' /> {!isCollapsed && 'Configuración'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/ayuda">
              <AiOutlineQuestionCircle className='sidebar-menu-icon' /> {!isCollapsed && 'Ayuda'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarProfile;