'use client';
import React, { useState, useEffect } from 'react';
import { FiClock } from "react-icons/fi";
import { GiSharkFin } from "react-icons/gi";
import { obtenerPropuestas } from '../app/utils/api';

type PropuestaType = {
  id: number;
  nombre: string;
  objetivo: string;
  palabras_clave: { id: number; palabra: string }[];
  fecha_creacion: string;
  fecha_actualizacion: string;
};

const PropuestaDiv = ({ searchTerm }: { searchTerm: string }) => {
  const [propuestas, setPropuestas] = useState<PropuestaType[]>([]);
  const [selected, setSelected] = useState<PropuestaType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propuestasPerPage = 4;

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const data = await obtenerPropuestas();
        setPropuestas(data);
      } catch (error) {
        console.error('Error al obtener propuestas:', error);
      }
    };

    fetchPropuestas();
  }, []);

  const handleSelect = (propuesta: PropuestaType) => {
    setSelected(propuesta);
  };

  const filteredPropuestas = propuestas.filter((propuesta) => 
    propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  const totalPropuestas = filteredPropuestas.length;
  const totalPages = Math.ceil(totalPropuestas / propuestasPerPage);
  const startIndex = (currentPage - 1) * propuestasPerPage;
  const selectedPropuestas = filteredPropuestas.slice(startIndex, startIndex + propuestasPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCloseDetails = () => {
    setSelected(null);
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex flex-col md:flex-row w-full'>
        <div className='w-full md:w-1/3'>
          <div className='grid grid-cols-1 gap-6 py-7'>
            {selectedPropuestas.map((propuesta) => (
              <div
                key={propuesta.id}
                onClick={() => handleSelect(propuesta)}
                className={`group propUnica p-5 bg-white rounded-xl hover:bg-secondary shadow-lg shadow-oscure-400/700 cursor-pointer flex flex-col justify-between ${selected && selected.id === propuesta.id ? 'bg-secondary' : ''}`}
              >
                <div className='flex flex-col h-full'>
                  <div className='flex justify-between items-start gap-2 mb-2'>
                    <h1 className='text-base font-semibold text-black group-hover:text-white break-words flex-grow'>{propuesta.nombre}</h1>
                    <span className='flex items-center text-gray-400 gap-1 whitespace-nowrap'>
                      <FiClock className="flex-shrink-0" /> {new Date(propuesta.fecha_actualizacion).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-sm text-gray-400 pt-2 border-t-2 mt-2 group-hover:text-white overflow-hidden line-clamp-4 flex-grow'>
                    {propuesta.objetivo}
                  </p>
                  <div className='palabras-clave flex flex-wrap gap-2 mt-auto pt-2'>
                    {propuesta.palabras_clave.slice(0, 3).map((palabra) => (
                      <span key={palabra.id} className='text-xs bg-gray-200 rounded-full px-2 py-1 truncate'>
                        {palabra.palabra}
                      </span>
                    ))}
                    {propuesta.palabras_clave.length > 3 && (
                      <span className='text-xs bg-gray-200 rounded-full px-2 py-1'>
                        +{propuesta.palabras_clave.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className='flex justify-center gap-4 mt-4'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className='px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300'
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className='px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300'
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        <div className='w-full md:w-2/3 p-5'>
          {selected ? (
            <div className='bg-white p-6 rounded-lg shadow-md relative'>
              <button 
                onClick={handleCloseDetails} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                &times;
              </button>
              <h2 className='text-2xl font-bold break-words'>{selected.nombre}</h2>
              <p className='text-gray-600 mt-2'>{selected.objetivo}</p>
              <p className='mt-2'><strong>Fecha de creación:</strong> {new Date(selected.fecha_creacion).toLocaleString()}</p>
              <p><strong>Última actualización:</strong> {new Date(selected.fecha_actualizacion).toLocaleString()}</p>
              <div className='mt-4'>
                <strong>Palabras clave:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {selected.palabras_clave.map((palabra) => (
                    <span key={palabra.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {palabra.palabra}
                    </span>
                  ))}
                </div>
              </div>
              <div className='mt-5 flex justify-end gap-4'>
                <button className='bg-primary text-white px-4 py-2 rounded hover:bg-primary/80'>
                  Contactar
                </button>
                <button className='bg-help2 text-white px-4 py-2 rounded hover:bg-help2/80'>
                  Reportar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {totalPropuestas === 0 && (
        <div className="flex flex-col items-center justify-center h-[20rem] w-full mt-4">
          <GiSharkFin className="text-8xl mb-4" />
          <p className='text-gray-400 text-3xl text-center'>No hay resultados</p>
        </div>
      )}
    </div>
  );
};

export default PropuestaDiv;