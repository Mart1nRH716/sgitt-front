'use client';

import React, { useEffect, useState } from 'react';
import { obtenerPropuestasUsuario , eliminarPropuesta  } from '../app/utils/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Plus , Edit2 , Trash2  } from 'lucide-react';
import EditarPropuestaModal from './EditarPropuestaModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface Propuesta {
  id: number;
  nombre: string;
  objetivo: string;
  cantidad_alumnos: number;
  cantidad_profesores: number;
  requisitos: { id: number; descripcion: string }[];
  palabras_clave: { id: number; palabra: string }[];
  areas: { id: number; nombre: string }[];
  carrera: string;
  tipo_propuesta: string;
  datos_contacto: { id: number; dato: string }[];
  autor: {
    nombre: string;
    email: string;
    tipo: 'alumno' | 'profesor';
  };
  fecha_creacion: string;
  fecha_actualizacion: string;
}


interface MisPropuestasProps {}

const MisPropuestas: React.FC<MisPropuestasProps> = () => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const router = useRouter();
  const [propuestaEditar, setPropuestaEditar] = useState<Propuesta | null>(null);
  const [propuestaEliminar, setPropuestaEliminar] = useState<Propuesta | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


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

  const recargarPropuestas = async () => {
    try {
      const data = await obtenerPropuestasUsuario();
      setPropuestas(data);
    } catch (err) {
      console.error('Error al recargar propuestas:', err);
    }
  };

  const handleEliminarPropuesta = async () => {
    if (!propuestaEliminar) return;
    
    try {
      await eliminarPropuesta(propuestaEliminar.id);
      await recargarPropuestas();
      setIsDeleteModalOpen(false);
      setPropuestaEliminar(null);
    } catch (err) {
      console.error('Error al eliminar la propuesta:', err);
      // Opcionalmente, puedes mostrar un mensaje de error al usuario
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Propuestas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Agregar Nueva Propuesta - Siempre visible */}
        <button
          onClick={() => router.push('/propuesta/crear')}
          className="bg-white shadow-md rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-primary group transition-all duration-300 min-h-[250px] flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
            <Plus 
              size={30} 
              className="text-gray-400 group-hover:text-primary transition-colors duration-300" 
            />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 group-hover:text-primary transition-colors duration-300">
            Agregar Nueva Propuesta
          </p>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Haz clic aquí para crear una nueva propuesta
          </p>
        </button>
  
        {/* Propuestas existentes */}
        {propuestas.map((propuesta) => (
          <div key={propuesta.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 min-h-[250px] flex flex-col">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">{propuesta.nombre}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPropuestaEditar(propuesta)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Editar propuesta"
              >
                <Edit2 className="w-5 h-5 text-gray-600 hover:text-primary" />
              </button>
              <button
                onClick={() => {
                  setPropuestaEliminar(propuesta);
                  setIsDeleteModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Eliminar propuesta"
              >
                <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>
          </div>
            <p className="text-gray-600 mb-4 flex-grow">{propuesta.objetivo}</p>
            <div className="mt-auto">
              <p className="text-sm text-gray-500">Creada el: {new Date(propuesta.fecha_creacion).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Carrera: {propuesta.carrera}</p>
              <p><strong>Numero de alumnos: </strong> {propuesta.cantidad_alumnos}</p>
              <p><strong>Numero de profesores: </strong> {propuesta.cantidad_profesores}</p>
              <p><strong>Tipo de propuesta: </strong> {propuesta.tipo_propuesta}</p>

              <div className='mt-4'>
                <strong>Datos de Contacto:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {propuesta.datos_contacto.map((dato) => (
                    <span key={dato.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {dato.dato}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-4'>
                <strong>Requisitos:</strong>
                <ul className='list-disc list-inside mt-2'>
                  {propuesta.requisitos.map((requisito) => (
                    <li key={requisito.id}>{requisito.descripcion}</li>
                  ))}
                </ul>
              </div>

              <div className='mt-4'>
                <strong>Áreas de conocimiento:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {propuesta.areas.map((area) => (
                    <span key={area.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {area.nombre}
                    </span>
                  ))}
                </div>
              </div>
              <div className='mt-4'>
                <strong>Palabras clave:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {propuesta.palabras_clave.map((palabra) => (
                    <span key={palabra.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {palabra.palabra}
                    </span>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        ))}
        {propuestaEditar && (
            <EditarPropuestaModal
              propuesta={propuestaEditar}
              onClose={() => setPropuestaEditar(null)}
              onUpdate={recargarPropuestas}
            />
          )}
      </div>

      {propuestaEliminar && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleEliminarPropuesta}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setPropuestaEliminar(null);
          }}
          nombre={propuestaEliminar.nombre}
        />
      )}
  
      {propuestas.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
          <p className="font-bold">No tienes propuestas</p>
          <p>Aún no has creado ninguna propuesta. ¡Empieza creando una ahora!</p>
        </div>
      )}
    </div>
  );
};

export default MisPropuestas;