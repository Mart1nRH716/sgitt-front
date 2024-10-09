'use client';
import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";

interface SideBarProfileProps {
  isCollapsed: boolean;
}

const SideBarProfile: React.FC<SideBarProfileProps> = ({ isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`fixed top-16 transition-all overflow-hidden left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-secondary border-r bottom-0 z-40`} id='sidebar'>
      <a href="#" className='p-4 flex items-center gap-4 hover:bg-help3'>
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
      </a>

      <div className='py-4'>
        <span className={`text-sm text-gray-500 uppercase ml-4 inline-block mb-2 ${isCollapsed ? 'hidden' : ''}`}>Menú</span>
        <ul className="sidebar-menu">
          <li>
            <a href="#" className='active'>
              <FaHome className='sidebar-menu-icon' /> {!isCollapsed && 'Inicio'}
            </a>
          </li>
          <li>
            <a href="#" onClick={toggleDropdown} className={isDropdownOpen ? 'active' : ''}>
              <IoMdPaper className='sidebar-menu-icon' /> {!isCollapsed && 'Propuestas'}
            </a>
            {isDropdownOpen && !isCollapsed && (
              <ul className='sidebar-dropdown ml-4 border-l border-primary'>
                <li><a href="#">Sistemas Computacionales</a></li>
                <li><a href="#">Inteligencia Artificial</a></li>
                <li><a href="#">Ciencia de Datos</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="#">
              <FaBookmark className='sidebar-menu-icon' /> {!isCollapsed && 'Ver Más Tarde'}
            </a>
          </li>
          <li>
            <a href="#">
              <GoGear className='sidebar-menu-icon' /> {!isCollapsed && 'Configuración'}
            </a>
          </li>
          <li>
            <a href="#">
              <AiOutlineQuestionCircle className='sidebar-menu-icon' /> {!isCollapsed && 'Ayuda'}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarProfile;
