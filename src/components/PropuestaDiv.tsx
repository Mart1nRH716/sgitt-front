// PropuestaDiv.tsx
'use client'; // Esto marca el componente como Client Component
import React, { useState } from 'react';
import { FiClock } from "react-icons/fi";
import { Propuesta } from '../utils/propuestas'; // Importa las propuestas
import { GiSharkFin } from "react-icons/gi";

type PropuestaType = {
  id: number;
  logo: JSX.Element;
  nombre: string;
  time: string;
  area: string;
  descripcion: string;
  carrera: string;
};

const PropuestaDiv = ({ searchTerm }: { searchTerm: string }) => { // Agrega la prop searchTerm
  const [selected, setSelected] = useState<PropuestaType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propuestasPerPage = 4;

  // Función para manejar la selección de propuesta
  const handleSelect = (propuesta: PropuestaType) => {
    setSelected(propuesta);
  };

  // Filtrar las propuestas basadas en el término de búsqueda
  const filteredPropuestas = Propuesta.filter((propuesta) => 
    propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))  );

  // Funciones de paginación
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

  // Función para cerrar la información detallada
  const handleCloseDetails = () => {
    setSelected(null);
  };

  return (
    <div className='flex flex-col items-center'> {/* Cambiar a flex-col para alinear verticalmente */}
      <div className='flex w-full'>
        {/* Tarjetas a la izquierda */}
        <div className='w-1/3'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 py-7'>
            {selectedPropuestas.map((propuesta) => (
              <div
                key={propuesta.id}
                onClick={() => handleSelect(propuesta)}
                className={`group propUnica p-5 bg-white rounded-xl hover:bg-secondary shadow-lg shadow-oscure-400/700 cursor-pointer h-[20rem] flex flex-col justify-between ${selected && selected.id === propuesta.id ? 'bg-secondary' : ''}`}
              >
                <div>
                  <span className='flex justify-between items-center gap-4'>
                    <h1 className='text-base font-semibold text-black group-hover:text-white'>{propuesta.nombre}</h1>
                    <span className='flex items-center text-gray-400 gap-1'>
                      <FiClock /> {propuesta.time}
                    </span>
                  </span>
                  <h6 className='text-gray-500'>{propuesta.area}</h6>
                  <p className='text-sm text-gray-400 pt-5 border-t-2 mt-5 group-hover:text-white overflow-hidden line-clamp-5'>
                    {propuesta.descripcion}
                  </p>
                </div>
                <div className='carrera flex items-center gap-2 mt-auto'>
                  {propuesta.logo}
                  <span className='text-sm py-4 block group-hover:text-white'>{propuesta.carrera}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
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

        {/* Información detallada a la derecha */}
        <div className='w-2/3 p-5'>
          {selected ? (
            <div className='bg-white p-6 rounded-lg shadow-md relative'>
              {/* Botón para cerrar la información detallada */}
              <button 
                onClick={handleCloseDetails} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                &times; {/* Símbolo de "X" */}
              </button>
              <h2 className='text-2xl font-bold'>{selected.nombre}</h2>
              <p className='text-gray-600'>{selected.descripcion}</p>
              <p><strong>Área:</strong> {selected.area}</p>
              <p><strong>Carrera:</strong> {selected.carrera}</p>
              <p><strong>Tiempo:</strong> {selected.time}</p>

              {/* Botones de acción a la derecha */}
              <div className='mt-5 flex justify-end gap-4'>
                <button className='bg-primary text-white px-4 py-2 rounded hover:bg-primary/80'>
                  Contactar
                </button>
                <button className='bg-help2 text-white px-4 py-2 rounded hover:bg-help2/80'>
                  Reportar
                </button>
              </div>
            </div>
          ) : null} {/* Eliminado el mensaje si no hay selección */}
        </div>
      </div>

      {/* Mensaje de "No hay resultados" */}
      {totalPropuestas === 0 && (
        <div className="flex flex-col items-center justify-center h-[20rem] w-full mt-4"> {/* Ajusta la altura al espacio de información detallada */}
          <GiSharkFin className="text-8xl mb-4" /> {/* Aumenta aún más el tamaño del ícono */}
          <p className='text-gray-400 text-3xl text-center'>No hay resultados</p> {/* Aumenta aún más el tamaño del texto y centra */}
        </div>
      )}
    </div>
  );
};

export default PropuestaDiv;
