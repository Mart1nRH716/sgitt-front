'use client';

import React, { useEffect, useState } from 'react';
import { obtenerPropuestasUsuario } from '../app/utils/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Propuesta {
  id: number;
  nombre: string;
  objetivo: string;
  fecha_creacion: string;
  areas: { id: number; nombre: string }[];
  carrera: string; 
}

interface MisPropuestasProps {
  isSidebarCollapsed: boolean;
}

const MisPropuestas: React.FC<MisPropuestasProps> = ({ isSidebarCollapsed }) => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const data = await obtenerPropuestasUsuario();
        setPropuestas(data);
      } catch (err) {
        console.error('Error completo:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError('No estás autorizado para ver esta información. Por favor, inicia sesión nuevamente.');
            setIsUnauthorized(true);
          } else {
            setError(err.response?.data?.message || `Error del servidor: ${err.response?.status}`);
          }
        } else {
          setError('Error inesperado. Por favor, intenta de nuevo más tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropuestas();
  }, [router]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isSidebarCollapsed ? 'pl-16' : 'md:pl-64'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${isSidebarCollapsed ? 'pl-16' : 'md:pl-64'}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          {isUnauthorized && (
            
            <>
      <br />
      <div className="flex justify-center">
        <button
          onClick={handleLoginRedirect}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
        >
          Ir al Login
        </button>
      </div>
    </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all ${isSidebarCollapsed ? 'pl-16' : 'md:pl-64'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Propuestas</h1>
        {propuestas.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">No tienes propuestas</p>
            <p>Aún no has creado ninguna propuesta. ¿Qué tal si comienzas creando una ahora?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propuestas.map((propuesta) => (
            <div key={propuesta.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{propuesta.nombre}</h2>
              <p className="text-gray-600 mb-4">{propuesta.objetivo}</p>
              <p className="text-sm text-gray-500">Creada el: {new Date(propuesta.fecha_creacion).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Carrera: {propuesta.carrera}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Áreas de conocimiento:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {propuesta.areas.map((area) => (
                    <span key={area.id} className="text-xs bg-gray-200 rounded-full px-2 py-1">
                      {area.nombre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default MisPropuestas;