// Buscador.tsx
'use client';
import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MdOutlineCancel } from "react-icons/md";
import { buscarProfesores } from '../app/utils/api';

interface Profesor {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  matricula: string;
  materias: string;
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
    console.log(`Contactando a ${profesor.nombre} ${profesor.apellido}`);
  };

  return (
    <div className='buscadorDiv bg-secondary rounded-lg p-4 md:p-6 lg:p-[3rem] space-y-6 md:space-y-10'>
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
          <div key={profesor.id} className='profesorCard bg-white p-4 rounded-lg shadow-md'>
            <h3 className='text-lg font-bold'>{`${profesor.nombre} ${profesor.apellido}`}</h3>
            <p>Correo: {profesor.email}</p>
            <p>Materias: {profesor.materias}</p>
            <button 
              className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-300 w-full'
              onClick={() => handleContactar(profesor)}
            >
              Contactar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Buscador;