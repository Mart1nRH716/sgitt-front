'use client';
import React, { useState, useEffect } from 'react';
import { FiClock } from "react-icons/fi";
import { GiSharkFin } from "react-icons/gi";
import { obtenerPropuestas, obtenerAreas  } from '../app/utils/api';

type PropuestaType = {
  id: number;
  nombre: string;
  objetivo: string;
  palabras_clave: { id: number; palabra: string }[];
  areas: { id: number; nombre: string }[];
  carrera: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  autor: {
    nombre: string;
    email: string;
    tipo: 'alumno' | 'profesor';
  };
};

interface Area {
  id: number;
  nombre: string;
}

const PropuestaDiv = ({ searchTerm }: { searchTerm: string }) => {
  const [propuestas, setPropuestas] = useState<PropuestaType[]>([]);
  const [selected, setSelected] = useState<PropuestaType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propuestasPerPage = 4;
  const [ordenarPor, setOrdenarPor] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("");
  const [carreraFiltro, setCarreraFiltro] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propuestasData, areasData] = await Promise.all([
          obtenerPropuestas(),
          obtenerAreas()
        ]);
        setPropuestas(propuestasData);
        setAreas(areasData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (propuesta: PropuestaType) => {
    setSelected(propuesta);
  };

  //const filteredPropuestas = propuestas.filter((propuesta) => 
  //propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  //);


  const aplicarFiltros = (propuestas: PropuestaType[]) => {
    let resultado = propuestas;

    // Filtro por término de búsqueda
    if (searchTerm) {
      resultado = resultado.filter((propuesta) =>
        propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      );
    }

    // Filtro por área
    if (areaFiltro) {
      resultado = resultado.filter((propuesta) => 
        propuesta.areas.some(area => area.id.toString() === areaFiltro)
      );
    }

    // Filtro por carrera
    if (carreraFiltro) {
      resultado = resultado.filter((propuesta) =>
        propuesta.carrera.toLowerCase() === carreraFiltro.toLowerCase()
      );
    }

    // Ordenar
    if (ordenarPor) {
      resultado.sort((a, b) => {
        switch (ordenarPor) {
          case 'fecha':
            return new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime();
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          // Puedes añadir más casos de ordenación aquí
          default:
            return 0;
        }
      });
    }

    return resultado;
  };

  const filteredPropuestas = aplicarFiltros(propuestas);


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
      <div className='flex flex-wrap items-center gap-4 justify-center mb-6 bg-secondary p-4 rounded-lg w-full'>
        <div className='busquedaUnica flex items-center gap-2'>
          <label htmlFor="ordenar" className='text-oscure font-bold'>Ordenar: </label>
          <select 
            id="ordenar" 
            className='bg-white rounded-md px-4 py-1'
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="fecha">Fecha</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>

        <div className='busquedaUnica flex items-center gap-2'>
          <label htmlFor="area" className='text-oscure font-bold'>Áreas: </label>
          <select 
            id="area" 
            className='bg-white rounded-md px-4 py-1'
            value={areaFiltro}
            onChange={(e) => setAreaFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id.toString()}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className='busquedaUnica flex items-center gap-2'>
          <label htmlFor="carrera" className='text-oscure font-bold'>Carrera: </label>
          <select 
            id="carrera" 
            className='bg-white rounded-md px-4 py-1'
            value={carreraFiltro}
            onChange={(e) => setCarreraFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="LCD">Ciencia de Datos</option>
            <option value="ISC">Sistemas Computacionales</option>
            <option value="IIA">Inteligencia Artificial</option>
          </select>
        </div>

        <button 
          className='text-oscure cursor-pointer font-bold hover:text-help2'
          onClick={() => {
            setOrdenarPor("");
            setAreaFiltro("");
            setCarreraFiltro("");
          }}
        >
          Limpiar filtros
        </button>
      </div>
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
                  <p className='text-xs text-gray-500 group-hover:text-white mt-2'>
                    Autor: {propuesta.autor.nombre} ({propuesta.autor.tipo})
                  </p>
                  <p className='text-xs text-gray-500 group-hover:text-white mt-2'>
                    Carrera: {propuesta.carrera}
                  </p>
                  <div className='areas flex flex-wrap gap-2 mt-2'>
                    {propuesta.areas.slice(0, 2).map((area) => (
                      <span key={area.id} className='text-xs bg-gray-200 rounded-full px-2 py-1 truncate'>
                        {area.nombre}
                      </span>
                    ))}
                    {propuesta.areas.length > 2 && (
                      <span className='text-xs bg-gray-200 rounded-full px-2 py-1'>
                        +{propuesta.areas.length - 2}
                      </span>
                    )}
                  </div>
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
              <p className='mt-2'><strong>Autor:</strong> {selected.autor.nombre} ({selected.autor.tipo})</p>
              <p><strong>Carrera:</strong> {selected.carrera}</p>
              <p><strong>Correo:</strong> {selected.autor.email}</p>
              <div className='mt-4'>
                <strong>Áreas de conocimiento:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {selected.areas.map((area) => (
                    <span key={area.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {area.nombre}
                    </span>
                  ))}
                </div>
              </div>
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