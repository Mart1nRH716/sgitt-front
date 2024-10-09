// Perfil.tsx
'use client';
import React, { useState } from 'react';
import { LuPencilLine } from "react-icons/lu";

const MainProfile: React.FC<{ isSidebarCollapsed: boolean }> = ({ isSidebarCollapsed }) => {
    const [activeTab, setActiveTab] = useState('seguridad'); // Estado para el tab activo

    return (
      <div className={`transition-all ${isSidebarCollapsed ? 'pl-16' : 'md:pl-64'}`} id='main'>
        <div className='p-4'>
          Prueba
            <div className='relative'>
                <img src="https://images.unsplash.com/photo-1606942040878-9a852c5045a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-full h-72 object-cover rounded-lg' alt="Base" />
                <a href="#" className=' absolute top-4 left-4 w-8 h-8 rounded-full bg-help3 hover:bg-help1 flex items-center justify-center'>
                    <LuPencilLine />
                </a>
            </div>
            <div className='flex items-center gap-8 '>
                <img src="https://plus.unsplash.com/premium_photo-1693723595870-2b8bad09b4c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGF6dWx8ZW58MHx8MHx8fDA%3D" alt="Perfil" className='w-28 h-28 object-cover rounded-full mt-2'/>
                <div>
                    <h2 className='text-2xl font-semibold mb-2'> Nombre de Usuario</h2>
                    <span className='text-lg text-gray-500'>Alumno o Profesor</span>
                </div>
                <a href="#" className='py-2 px-4 rounded bg-secondary flex items-center gap-2 text-white hover:bg-primary ml-auto'>
                    <LuPencilLine className=' mr-2 mt-1' /> Editar Perfil
                </a>
            </div>
            <p className='text-gray-500 text-lg mt-4 mb-8'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque unde necessitatibus, aliquam suscipit corporis consequatur velit non ipsum ratione sit, nobis sequi modi quasi, deleniti officia nisi explicabo fuga ea?</p>
            <div>
                <div className='flex items-center gap-8 tab-indicator border-b border-help3 cursor-pointer'>
                    <span className={`${activeTab === 'seguridad' ? 'active' : ''}`} onClick={() => setActiveTab('seguridad')}>Seguridad</span>
                    <span className={`${activeTab === 'actividad' ? 'active' : ''}`} onClick={() => setActiveTab('actividad')}>Mi actividad</span>
                    <span className={`${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>Información de Contacto</span>
                </div>
                <div className='tab-content pt-2'>
                    {activeTab === 'seguridad' && (
                        <div id='seguridad'>
                            <h2 className='text-2xl font-semibold'>Seguridad</h2>
                        </div>
                    )}
                    {activeTab === 'actividad' && (
                        <div id='actividad'>
                            <h2 className='text-2xl font-semibold'>Mi Actividad</h2>
                        </div>
                    )}
                    {activeTab === 'contacto' && (
                        <div id='contacto'>
                            <h2 className='text-2xl font-semibold'>Información de Contacto</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
};

export default MainProfile;
