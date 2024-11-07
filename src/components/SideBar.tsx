'use client';
import React,  { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { AiOutlineHome, AiOutlineUser,AiOutlineQuestionCircle } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import Image from 'next/image';
import alumnoIcono from '../utils/alumno_icono.png';
import profesorIcono from '../utils/profesor_icono.png';
import { logout } from '../app/utils/authUtils';



interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const [userType, setUserType] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserType(localStorage.getItem('user-Type') || 'Usuario');
      setUserEmail(localStorage.getItem('userEmail') || '');
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home' ? 'active' : '';
    }
    if (path === '/perfil') {
      return pathname === '/perfil' ? 'active' : '';
    }
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className={`fixed top-[64px] transition-all overflow-hidden left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-secondary border-r bottom-0 z-40`} id='sidebar'>
      <Link href="/perfil" className='p-4 flex items-center gap-4 hover:bg-help3'>
      

        <Image
          src={userType === 'alumno' ? alumnoIcono : profesorIcono}
          className='w-16 aspect-square object-cover rounded'
          alt="Perfil"
        />
        {!isCollapsed && (
          <div className='sidebar-user-profile w-full'>
            <p className="text-[10px] font-medium mb-1 truncate max-w-[160px]">{userEmail}</p>
            <span className='py-1 px-2 rounded-full bg-primary text-white text-xs font-medium inline-block'>
              {userType === 'alumno' ? 'Alumno' : 'Profesor'}
            </span>
          </div>
        )}
      </Link>

      <div className='py-4'>
        <span className={`text-sm text-gray-500 uppercase ml-4 inline-block mb-2 ${isCollapsed ? 'hidden' : ''}`}>Menú</span>
        <ul className="sidebar-menu">
          <li>
            <Link href="/home" className={isActive('/home')}>
              <AiOutlineHome className='sidebar-menu-icon' /> {!isCollapsed && 'Inicio'}
            </Link>
          </li>
          <li>
            <Link href="/perfil" className={isActive('/perfil')}>
              <AiOutlineUser className='sidebar-menu-icon' /> {!isCollapsed && 'Mi Perfil'}
            </Link>
          </li>
          <li>
            <Link href="/perfil/mispropuestas" className={isActive('/perfil/mispropuestas')}>
              <IoMdPaper className='sidebar-menu-icon' /> {!isCollapsed && 'Mis Propuestas'}
            </Link>
          </li>
          {/*
           
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

           */}
          <li>
            <Link href="/ayuda" className={isActive('/ayuda')}>
              <AiOutlineQuestionCircle className='sidebar-menu-icon' /> {!isCollapsed && 'Ayuda'}
            </Link>
          </li>
          <li>
            <button 
              onClick={logout}
              className="flex items-center gap-4 py-2 px-3 hover:bg-help3 font-medium text-lg border-l-4 border-transparent whitespace-nowrap w-full"
            >
              <BiLogOut className='sidebar-menu-icon' /> 
              {!isCollapsed && 'Cerrar Sesión'}
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;