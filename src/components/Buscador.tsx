// Buscador.tsx
'use client';
import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MdOutlineCancel } from "react-icons/md";
import { buscarProfesores } from '../app/utils/api';

interface Materia {
  id: number;
  nombre: string;
}

interface Profesor {
  id: number;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  materias: Materia[];
  areas_profesor: Array<{id: number, nombre: string}>;
  departamento: string;  
}

interface BuscadorProps {
  onSearch: (term: string) => void;
}

const Buscador: React.FC<BuscadorProps> = ({ onSearch }) => {
  const [buscar, setBuscar] = useState("");
  const [resultados, setResultados] = useState<Profesor[]>([]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const profesores = await buscarProfesores(buscar);
      setResultados(profesores);
    } catch (error) {
      console.error('Error al buscar profesores:', error);
    }
  };

  const handleContactar = (profesor: Profesor) => {
    console.log(`Contactando a ${profesor.nombre} ${profesor.apellido_paterno} ${profesor.apellido_materno}`);
  };

  return (
    <div className='buscadorDiv bg-secondary rounded-lg p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 mt-4'>
      <form onSubmit={handleSearch} className='w-full'>
        <div className='flex flex-col md:flex-row items-center rounded-xl gap-4 p-3 md:p-5 shadow-sm shadow-oscure bg-white'>
          <div className='flex gap-2 items-center w-full'>
            <BiSearchAlt className='text-xl icon' />
            <input 
              type="text" 
              className='bg-transparent text-oscure focus:outline-none w-full' 
              placeholder='Ingresa tu objetivo / idea de protocolo para recomendar profesores' 
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
            <MdOutlineCancel 
              className='text-xl icon text-red-500 hover:text-oscure cursor-pointer' 
              onClick={() => setBuscar('')} 
            />
          </div>
          <button className='bg-oscure w-full md:w-auto py-2 px-4 md:px-10 rounded-xl text-white cursor-pointer hover:bg-primary transition-colors'>
            Buscar
          </button>
        </div>
      </form>
      <div className='resultadosDiv grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {resultados.map((profesor) => (
          <div key={profesor.id} className='profesorCard bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
            <div className="flex flex-col h-full">
              <h3 className='text-lg font-bold'>
                {`${profesor.nombre} ${profesor.apellido_paterno} ${profesor.apellido_materno}`}
              </h3>
              
              {/* Información de contacto y departamento */}
              <div className="space-y-2 mt-2">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Correo:</span> {profesor.email}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Departamento:</span> {profesor.departamento}
                </p>
              </div>
            
              {/* Materias */}
              <div className="mt-4">
                <p className="font-semibold text-gray-700">Materias:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profesor.materias.length > 0 ? (
                    profesor.materias.map((materia) => (
                      <span 
                        key={materia.id}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {materia.nombre}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No hay materias registradas</p>
                  )}
                </div>
              </div>

              {/* Áreas de conocimiento */}
              <div className="mt-4">
                <p className="font-semibold text-gray-700">Áreas de conocimiento:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profesor.areas_profesor && profesor.areas_profesor.length > 0 ? (
                    profesor.areas_profesor.map((area) => (
                      <span 
                        key={area.id}
                        className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {area.nombre}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No hay áreas de conocimiento registradas</p>
                  )}
                </div>
              </div>

              {/* Botón de contactar */}
              <button 
                className='mt-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-300 w-full flex items-center justify-center gap-2'
                onClick={() => handleContactar(profesor)}
              >
                <span>Contactar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Buscador;