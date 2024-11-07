'use client';
import React, { useState, useEffect } from 'react';
import { FiClock } from "react-icons/fi";
import { GiSharkFin } from "react-icons/gi";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { obtenerPropuestas, obtenerAreas  } from '../app/utils/api';
import MultiSelect from './MultiSelect';

type PropuestaType = {
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
  visible: boolean;
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
  const [carreraFiltro, setCarreraFiltro] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [userType, setUserType] = useState<'alumno' | 'profesor' | null>(null);
  const [autorFiltro, setAutorFiltro] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
  const [departamentoFiltro, setDepartamentoFiltro] = useState("");

 

  useEffect(() => {
    // Obtener el tipo de usuario del localStorage
    const storedUserType = localStorage.getItem('user-Type') as 'alumno' | 'profesor';
    setUserType(storedUserType);

    const fetchData = async () => {
      try {
        const [propuestasData, areasData] = await Promise.all([
          obtenerPropuestas(),
          obtenerAreas()
        ]);
        
        // Filtrar propuestas según el tipo de usuario
        const filteredPropuestas = storedUserType === 'profesor' 
          ? propuestasData.filter(p => p.autor.tipo === 'alumno')
          : propuestasData;
        
        setPropuestas(filteredPropuestas);
        setAreas(areasData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  const getAuthorTypeIcon = (type: 'alumno' | 'profesor') => {
    return type === 'alumno' 
      ? <FaUserGraduate className="w-5 h-5 text-blue-500" />
      : <FaChalkboardTeacher className="w-5 h-5 text-green-500" />;
  };

  const getAuthorTypeStyle = (type: 'alumno' | 'profesor') => {
    return type === 'alumno'
      ? 'border-l-4 border-blue-500'
      : 'border-l-4 border-green-500';
  };

  const handleSelect = (propuesta: PropuestaType) => {
    setSelected(propuesta);
  };

  //const filteredPropuestas = propuestas.filter((propuesta) => 
  //propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  //);


  const aplicarFiltros = (propuestas: PropuestaType[]) => {
    let resultado = propuestas;

    // Filtro por carrera
    if (carreraFiltro) {
      resultado = resultado.filter((propuesta) =>
        propuesta.carrera.toLowerCase() === carreraFiltro.toLowerCase()
      );
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      resultado = resultado.filter((propuesta) =>
        propuesta.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      );
    }

    // Filtro por área
    if (selectedAreas.length > 0) {
      resultado = resultado.filter((propuesta) => 
        propuesta.areas.some(propuestaArea => 
          selectedAreas.some(selectedArea => selectedArea.id === propuestaArea.id)
        )
      );
    }


    // Filtro por tipo de autor (solo si hay un filtro seleccionado)
    if (autorFiltro) {
      resultado = resultado.filter((propuesta) => propuesta.autor.tipo === autorFiltro);
    }
    // Filtro por carrera (solo para alumnos)
  if (autorFiltro === 'alumno' && carreraFiltro) {
    resultado = resultado.filter((propuesta) =>
      propuesta.carrera.toLowerCase() === carreraFiltro.toLowerCase()
    );
  }

  // Filtro por departamento (solo para profesores)
  if (autorFiltro === 'profesor' && departamentoFiltro) {
    resultado = resultado.filter((propuesta) =>
      propuesta.carrera.toLowerCase() === departamentoFiltro.toLowerCase()
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

  const handleLimpiarFiltros = () => {
    setOrdenarPor("");
    setSelectedAreas([]);
    setCarreraFiltro("");
    setDepartamentoFiltro("");
    setAutorFiltro("");
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
    <div className='flex flex-col items-center w-full mt-6'>
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

        {/* Nuevo filtro por tipo de autor (solo visible para alumnos) */}
        {userType === 'alumno' && (
          <div className='busquedaUnica flex items-center gap-2'>
            <label htmlFor="autor" className='text-oscure font-bold'>Autor: </label>
            <select 
              id="autor" 
              className='bg-white rounded-md px-4 py-1'
              value={autorFiltro}
              onChange={(e) => setAutorFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="alumno">Alumnos</option>
              <option value="profesor">Profesores</option>
            </select>
          </div>
        )}

        <div className='busquedaUnica flex items-center gap-2 min-w-[250px]'>
          <label htmlFor="area" className='text-oscure font-bold whitespace-nowrap'>Áreas: </label>
          <MultiSelect
            options={areas}
            value={selectedAreas}
            onChange={setSelectedAreas}
            placeholder="Seleccionar áreas..."
            searchPlaceholder="Buscar área..."
          />
        </div>
        
        {autorFiltro && (
          <div className='busquedaUnica flex items-center gap-2'>
            {autorFiltro === 'alumno' ? (
              <>
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
              </>
            ) : (
              <>
                <label htmlFor="departamento" className='text-oscure font-bold'>Departamento: </label>
                <select 
                  id="departamento" 
                  className='bg-white rounded-md px-4 py-1'
                  value={departamentoFiltro}
                  onChange={(e) => setDepartamentoFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="CIC">CIC</option>
                  <option value="FB">FB</option>
                  <option value="FII">FII</option>
                  <option value="ISC">ISC</option>
                  <option value="POSGR">POSGR</option>
                  <option value="SUB ACAD">SUB ACAD</option>
                </select>
              </>
            )}
          </div>
        )}

        <button 
          className='text-oscure cursor-pointer font-bold hover:text-help2 transition-colors duration-300'
          onClick={handleLimpiarFiltros}
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
                className={`
                  group propUnica p-5 bg-white rounded-xl hover:bg-secondary 
                  shadow-lg shadow-oscure-400/700 cursor-pointer flex flex-col 
                  justify-between transition-all duration-300
                  ${selected && selected.id === propuesta.id ? 'bg-secondary' : ''}
                  ${getAuthorTypeStyle(propuesta.autor.tipo)}
                `}
                >
                <div className='flex flex-col h-full'>
                  <div className='flex justify-between items-start gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      {getAuthorTypeIcon(propuesta.autor.tipo)}
                      <h1 className='text-base font-semibold text-black group-hover:text-white break-words flex-grow'>
                        {propuesta.nombre}
                      </h1>
                    </div>
                    <span className='flex items-center text-gray-400 gap-1 whitespace-nowrap'>
                      <FiClock className="flex-shrink-0" /> 
                      {new Date(propuesta.fecha_actualizacion).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className='flex items-center gap-2 text-xs text-gray-500 group-hover:text-white mt-2'>
                    <span className={`px-2 py-1 rounded-full ${
                      propuesta.autor.tipo === 'alumno' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    } group-hover:bg-opacity-50`}>
                      {propuesta.autor.tipo === 'alumno' ? 'Alumno' : 'Profesor'}
                    </span>
                  </div>

                  <p className='text-sm text-gray-600 pt-2 border-t-2 mt-2 group-hover:text-white overflow-hidden line-clamp-4 flex-grow'>
                    {propuesta.objetivo}
                  </p>
                  
                  <div className='mt-2 space-y-1'>
                    <p className='text-xs text-gray-500 group-hover:text-white'>
                      {propuesta.autor.nombre}
                    </p>
                    <p className='text-xs text-gray-500 group-hover:text-white'>
                      {propuesta.autor.tipo === 'profesor' ? 'Departamento: ' : 'Carrera: '} 
                      {propuesta.carrera}
                    </p>
                  </div>

                  <div className='areas flex flex-wrap gap-2 mt-2'>
                    {propuesta.areas.slice(0, 2).map((area) => (
                      <span key={area.id} className='text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 truncate group-hover:bg-white/20 group-hover:text-white'>
                        {area.nombre}
                      </span>
                    ))}
                    {propuesta.areas.length > 2 && (
                      <span className='text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 group-hover:bg-white/20 group-hover:text-white'>
                        +{propuesta.areas.length - 2}
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
            <div className={`bg-white p-6 rounded-lg shadow-md relative ${getAuthorTypeStyle(selected.autor.tipo)}`}>
              <button
                onClick={handleCloseDetails}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                &times;
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                {getAuthorTypeIcon(selected.autor.tipo)}
                <h2 className='text-2xl font-bold break-words'>{selected.nombre}</h2>
              </div>
              <p className='text-gray-600 mt-2'>{selected.objetivo}</p>
              <p className='mt-2'><strong>Fecha de creación:</strong> {new Date(selected.fecha_creacion).toLocaleString()}</p>
              <p><strong>Última actualización:</strong> {new Date(selected.fecha_actualizacion).toLocaleString()}</p>
              <p>
                <strong>{selected.autor.tipo === 'profesor' ? 'Departamento:' : 'Carrera:'}</strong> {selected.carrera}
              </p>
              <p><strong>Correo:</strong> {selected.autor.email}</p>
              <p><strong>Tipo de Propuesta:</strong> {selected.tipo_propuesta}</p>
              <p><strong>Numero de alumnos: </strong> {selected.cantidad_alumnos}</p>
              <p><strong>Numero de profesores: </strong> {selected.cantidad_profesores}</p>

              <div className='mt-4'>
                <strong>Datos de Contacto:</strong>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {selected.datos_contacto.map((dato) => (
                    <span key={dato.id} className='bg-gray-200 rounded-full px-3 py-1 text-sm'>
                      {dato.dato}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-4'>
                <strong>Requisitos:</strong>
                <ul className='list-disc list-inside mt-2'>
                  {selected.requisitos.map((requisito) => (
                    <li key={requisito.id}>{requisito.descripcion}</li>
                  ))}
                </ul>
              </div>

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