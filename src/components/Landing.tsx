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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className='propDiv flex justify-center items-center'>
            <div className='group propUnica w-full sm:w-4/5 md:w-3/4 lg:w-2/3 p-8 sm:p-10 bg-white rounded-2xl hover:bg-secondary transition-all duration-300 shadow-xl hover:shadow-2xl'>
              <div className='space-y-6'>
                <h1 className='text-3xl sm:text-4xl font-bold text-black group-hover:text-white transition-colors'>Bienvenido a SGITT</h1>
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-700 group-hover:text-gray-200 transition-colors'>Sistema de Gestión Integral de Trabajos Terminales</h2>
                <p className='text-lg text-gray-600 pt-5 border-t-2 mt-5 group-hover:text-white transition-colors'>
                  Inicia sesión o regístrate para comenzar
                </p>
                <div className='space-y-4 mt-8'>
                  <button 
                    className='border-2 rounded-xl block p-4 w-full text-lg font-semibold bg-transparent hover:bg-white text-black group-hover:text-white hover:text-black transition-colors'
                    onClick={handleLogin}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    className='border-2 rounded-xl block p-4 w-full text-lg font-semibold bg-transparent hover:bg-white text-black group-hover:text-white hover:text-black transition-colors'
                    onClick={handleRegister}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing;