'use client';
import React, { useState } from 'react';
import { LuPencilLine } from "react-icons/lu";

const MainProfile = () => {
    const [activeTab, setActiveTab] = useState('seguridad');

    return (
        <div className="max-w-7xl mx-auto">
            <div className="relative mb-8">
                <img 
                    src="https://images.unsplash.com/photo-1606942040878-9a852c5045a3?q=80&w=1170&auto=format&fit=crop"
                    className="w-full h-72 object-cover rounded-lg"
                    alt="Cover"
                />
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-help3 hover:bg-help1 flex items-center justify-center transition-colors">
                    <LuPencilLine />
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                <img
                    src="https://plus.unsplash.com/premium_photo-1693723595870-2b8bad09b4c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGF6dWx8ZW58MHx8MHx8fDA%3D"
                    alt="Perfil"
                    className="w-28 h-28 object-cover rounded-full"
                />
                <div className="flex-grow">
                    <h2 className="text-2xl font-semibold mb-2">Nombre de Usuario</h2>
                    <span className="text-lg text-gray-500">Alumno o Profesor</span>
                </div>
                <button className="py-2 px-4 rounded bg-secondary hover:bg-primary transition-colors text-white flex items-center gap-2">
                    <LuPencilLine /> Editar Perfil
                </button>
            </div>

            <p className="text-gray-500 text-lg mb-8">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque unde necessitatibus...
            </p>

            <div className="border-b border-help3 mb-6">
                <div className="flex items-center gap-8 tab-indicator">
                    <button 
                        className={`pb-2 ${activeTab === 'seguridad' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguridad')}
                    >
                        Seguridad
                    </button>
                    <button 
                        className={`pb-2 ${activeTab === 'actividad' ? 'active' : ''}`}
                        onClick={() => setActiveTab('actividad')}
                    >
                        Mi actividad
                    </button>
                    <button 
                        className={`pb-2 ${activeTab === 'contacto' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contacto')}
                    >
                        Información de Contacto
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === 'seguridad' && (
                    <div id="seguridad">
                        <h2 className="text-2xl font-semibold">Seguridad</h2>
                        {/* Contenido de seguridad */}
                    </div>
                )}
                {activeTab === 'actividad' && (
                    <div id="actividad">
                        <h2 className="text-2xl font-semibold">Mi Actividad</h2>
                        {/* Contenido de actividad */}
                    </div>
                )}
                {activeTab === 'contacto' && (
                    <div id="contacto">
                        <h2 className="text-2xl font-semibold">Información de Contacto</h2>
                        {/* Contenido de contacto */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainProfile;