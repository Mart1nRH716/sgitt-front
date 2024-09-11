'use client'
import React from 'react';
import { useRouter } from 'next/navigation'
import { BiSearchAlt } from 'react-icons/bi'
import { FiClock } from "react-icons/fi";
import { FaComputer } from "react-icons/fa6";

const Landing: React.FC = () => {
  const router = useRouter();

  const handleLogin = (): void => {
    router.push('/login');
  };

  const handleRegister = (): void => {
    router.push('/registro');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className='propDiv flex gap-10 justify-center flex-wrap items-center py-7'>
            <div className='group group/item propUnica w-60 p-5 bg-white rounded-xl hover:bg-secondary shadow-lg shadow-oscure-400/700 hover:shadow-lg'>
              <span className='flex justify-between items-center gap-4'>
                <h1 className='text-base font-semibold text-black group-hover:text-white'>Bienvenido a SGITT</h1>
                <span className='flex items-center text-gray-400 gap-1'>
                </span>
              </span>
              <h6 className='text-gray-500'>Sistema de Gestión Integral de Trabajos Terminales</h6>
              <p className='text-sm text-gray-400 pt-5 border-t-2 mt-5 group-hover:text-white'>
                Inicia sesión o regístrate
              </p>
              <button 
                className='border-2 rounded-xl block p-2 w-full text-sm font-semibold hover:bg-white group-hover/item:text-black group-hover:text-white mt-4'
                onClick={handleLogin}
              >
                Iniciar Sesión
              </button>
              <button 
                className='border-2 rounded-xl block p-2 w-full text-sm font-semibold hover:bg-white group-hover/item:text-black group-hover:text-white mt-2'
                onClick={handleRegister}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing;