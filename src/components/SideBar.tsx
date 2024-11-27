// src/components/SideBar.tsx

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import { AiOutlineHome, AiOutlineUser, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import Image from 'next/image';
import alumnoIcono from '../utils/alumno_icono.png';
import profesorIcono from '../utils/profesor_icono.png';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const [userType, setUserType] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Obtener datos del localStorage
      const storedUserType = localStorage.getItem('user-Type');
      const storedEmail = localStorage.getItem('userEmail');
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

      setUserType(storedUserType || 'Usuario');
      setUserEmail(storedEmail || '');
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home' ? 'active' : '';
    }
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className={`fixed top-[64px] transition-all overflow-hidden left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-secondary border-r bottom-0 z-40 md:block ${isCollapsed ? 'hidden' : 'block'}`} id='sidebar'>
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

          {isAdmin && (
            <li>
              <Link href="/admin" className={isActive('/admin')}>
                <MdAdminPanelSettings className='sidebar-menu-icon' /> 
                {!isCollapsed && 'Panel Admin'}
              </Link>
            </li>
          )}

          <li>
            <Link href="/ayuda" className={isActive('/ayuda')}>
              <AiOutlineQuestionCircle className='sidebar-menu-icon' /> {!isCollapsed && 'Ayuda'}
            </Link>
          </li>
          <li>
            <Link href="/login" className={isActive('/login')} onClick={() => {
              localStorage.clear();
            }}>
              <BiLogOut className='sidebar-menu-icon' /> {!isCollapsed && 'Cerrar Sesión'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;