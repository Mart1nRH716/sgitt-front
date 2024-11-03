'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect,useRef } from 'react';
import { PlusCircle, X , Check, ChevronDown} from 'lucide-react';
import { crearPropuesta,obtenerAreas  } from '../app/utils/api';
import { useRouter } from 'next/navigation';
import MultiSelect from './MultiSelect';

interface Area {
  id: number;
  nombre: string;
}

interface PropuestaForm {
  nombre: string;
  objetivo: string;
  cantidad_alumnos: number;
  cantidad_profesores: number;
  requisitos: string[];
  palabras_clave: string[];
  areas: string[];
  tipo_propuesta: string;
  datos_contacto: string[];
}

  
  const CrearPropuesta: React.FC = () => {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [nuevoDatoContacto, setNuevoDatoContacto] = useState('');
    const [areasDisponibles, setAreasDisponibles] = useState<Area[]>([]);
    const [areasSeleccionadas, setAreasSeleccionadas] = useState<Area[]>([]);
    const [customArea, setCustomArea] = useState('');
    const [areaSearch, setAreaSearch] = useState('');
    const [isAreasDropdownOpen, setIsAreasDropdownOpen] = useState(false);
    const areaInputRef = useRef<HTMLDivElement>(null);

    // Agregar useEffect para cargar las áreas disponibles
    useEffect(() => {
      const fetchAreas = async () => {
        try {
          const data = await obtenerAreas();
          setAreasDisponibles(data);
        } catch (error) {
          console.error('Error al cargar áreas:', error);
        }
      };
      fetchAreas();
    
      const handleClickOutside = (event: MouseEvent) => {
        if (areaInputRef.current && !areaInputRef.current.contains(event.target as Node)) {
          setIsAreasDropdownOpen(false);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Modifica el handleAddArea:
    const handleAddArea = (areaToAdd: string | Area) => {
      const areaName = typeof areaToAdd === 'string' ? areaToAdd : areaToAdd.nombre;
      if (areaName.trim() && !propuesta.areas.includes(areaName.trim())) {
        setPropuesta(prev => ({
          ...prev,
          areas: [...prev.areas, areaName.trim()]
        }));
      }
      setAreaSearch('');
      setIsAreasDropdownOpen(false);
    };
    

    const [propuesta, setPropuesta] = useState<PropuestaForm>({
      nombre: '',
      objetivo: '',
      cantidad_alumnos: 1,
      cantidad_profesores: 1,
      requisitos: [],
      palabras_clave: [],
      areas: [],
      tipo_propuesta: 'TT1',
      datos_contacto: [localStorage.getItem('userEmail') || ''], // Email del usuario por defecto
    });

    const [nuevoRequisito, setNuevoRequisito] = useState('');
    const [nuevaPalabraClave, setNuevaPalabraClave] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nuevaArea, setNuevaArea] = useState('');
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target as HTMLInputElement; // Type assertion para acceder a la propiedad type
      if (type === 'radio') {
        setPropuesta(prev => ({ ...prev, [name]: value }));
      } else {
        setPropuesta(prev => ({ ...prev, [name]: value }));
      }
    };

    const handleAddDatoContacto = () => {
      if (nuevoDatoContacto.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          datos_contacto: [...prev.datos_contacto, nuevoDatoContacto.trim()]
        }));
        setNuevoDatoContacto('');
      }
    };
    const handleKeyPressContacto = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddDatoContacto();
      }
    };

    const handleRemoveDatoContacto = (index: number) => {
      // No permitir eliminar el email por defecto (índice 0)
      if (index === 0) return;
      
      setPropuesta(prev => ({
        ...prev,
        datos_contacto: prev.datos_contacto.filter((_, i) => i !== index)
      }));
    };
  
    const handleAddRequisito = () => {
      if (nuevoRequisito.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          requisitos: [...prev.requisitos, nuevoRequisito.trim()]
        }));
        setNuevoRequisito('');
      }
    };

    const handleKeyPressReq = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddRequisito();
      }
    };
    
    
  
    const handleAddPalabraClave = () => {
      if (nuevaPalabraClave.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          palabras_clave: [...prev.palabras_clave, nuevaPalabraClave.trim()]
        }));
        setNuevaPalabraClave('');
      }
    };
    const handleKeyPressPalabra = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddPalabraClave();
      }
    };
  
    const handleRemoveRequisito = (index: number) => {
      setPropuesta(prev => ({
        ...prev,
        requisitos: prev.requisitos.filter((_, i) => i !== index)
      }));
    };
  
    const handleRemovePalabraClave = (index: number) => {
      setPropuesta(prev => ({
        ...prev,
        palabras_clave: prev.palabras_clave.filter((_, i) => i !== index)
      }));
    };
/*
    const handleAddArea = () => {
      if (nuevaArea.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          areas: [...prev.areas, nuevaArea.trim()]
        }));
        setNuevaArea('');
      }
    };
    const handleKeyPressArea = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddArea();
      }
    };
  */
    const handleRemoveArea = (index: number) => {
      setPropuesta(prev => ({
        ...prev,
        areas: prev.areas.filter((_, i) => i !== index)
      }));
    };
  
     // Modifica el handleSubmit para incluir tanto áreas seleccionadas como personalizadas
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Combinar áreas seleccionadas y personalizadas
    const todasLasAreas = [
      ...areasSeleccionadas.map(area => area.nombre),
      ...propuesta.areas // Aquí estarán las áreas personalizadas
    ];

    try {
      const propuestaToSend = {
        ...propuesta,
        areas: todasLasAreas
      };

      const response = await crearPropuesta(propuestaToSend);
      console.log('Propuesta creada:', response);
      setSuccess(true);
      setTimeout(() => {
        router.push('/perfil/mispropuestas');
      }, 100);
    } catch (error) {
      console.error('Error al crear la propuesta:', error);
      setError('Hubo un error al crear la propuesta. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
   // Manejador para el cambio de áreas seleccionadas
   const handleAreasChange = (selectedAreas: Area[]) => {
    setAreasSeleccionadas(selectedAreas);
  };


    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Crear Nueva Propuesta</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Propuesta creada exitosamente. Redirigiendo...</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Propuesta</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={propuesta.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
            <textarea
              id="objetivo"
              name="objetivo"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={propuesta.objetivo}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="cantidad_alumnos" className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Alumnos</label>
              <input
                id="cantidad_alumnos"
                name="cantidad_alumnos"
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={propuesta.cantidad_alumnos}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cantidad_profesores" className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Profesores</label>
              <input
                id="cantidad_profesores"
                name="cantidad_profesores"
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={propuesta.cantidad_profesores}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propuesta
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="tt1"
                  name="tipo_propuesta"
                  value="TT1"
                  checked={propuesta.tipo_propuesta === 'TT1'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required
                />
                <label htmlFor="tt1" className="ml-2 text-sm text-gray-700">
                  TT1
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="remedial"
                  name="tipo_propuesta"
                  value="Remedial"
                  checked={propuesta.tipo_propuesta === 'Remedial'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="remedial" className="ml-2 text-sm text-gray-700">
                  TT Remedial
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={nuevoRequisito}
                onChange={(e) => setNuevoRequisito(e.target.value)}
                onKeyPress={handleKeyPressReq}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nuevo requisito"
              />
              <button
                type="button"
                onClick={handleAddRequisito}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {propuesta.requisitos.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                  <span className="flex-1">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequisito(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Áreas de Conocimiento
            </label>
            <div className="relative" ref={areaInputRef}>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white min-h-[42px]">
                {propuesta.areas.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {area}
                    <button
                      onClick={() => handleRemoveArea(index)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={areaSearch}
                  onChange={(e) => {
                    setAreaSearch(e.target.value);
                    setIsAreasDropdownOpen(true);
                  }}
                  className="flex-1 min-w-[200px] outline-none"
                  placeholder={propuesta.areas.length === 0 ? "Escribe para buscar o agregar áreas..." : ""}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && areaSearch.trim()) {
                      e.preventDefault();
                      handleAddArea(areaSearch);
                    }
                  }}
                />
              </div>

              {isAreasDropdownOpen && areaSearch.trim() && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {areasDisponibles
                    .filter(area => 
                      area.nombre.toLowerCase().includes(areaSearch.toLowerCase()) &&
                      !propuesta.areas.includes(area.nombre)
                    )
                    .map(area => (
                      <div
                        key={area.id}
                        className="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                        onClick={() => handleAddArea(area)}
                      >
                        <span>{area.nombre}</span>
                        <Check size={16} className="text-gray-400" />
                      </div>
                    ))
                  }
                  {!areasDisponibles.some(area => 
                    area.nombre.toLowerCase() === areaSearch.toLowerCase()
                  ) && areaSearch.trim() && (
                    <div
                      className="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 text-blue-600"
                      onClick={() => handleAddArea(areaSearch)}
                    >
                      <span>Agregar "{areaSearch}"</span>
                      <PlusCircle size={16} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Palabras Clave</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={nuevaPalabraClave}
                onChange={(e) => setNuevaPalabraClave(e.target.value)}
                onKeyPress={handleKeyPressPalabra}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nueva palabra clave"
              />
              <button
                type="button"
                onClick={handleAddPalabraClave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {propuesta.palabras_clave.map((palabra, index) => (
                <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                  <span>{palabra}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePalabraClave(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datos de Contacto</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={nuevoDatoContacto}
                onChange={(e) => setNuevoDatoContacto(e.target.value)}
                onKeyPress={handleKeyPressContacto}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nuevo dato de contacto"
              />
              <button
                type="button"
                onClick={handleAddDatoContacto}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {propuesta.datos_contacto.map((dato, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                  <span className="flex-1">{dato}</span>
                  {index !== 0 && ( // Solo mostrar el botón de eliminar si no es el email por defecto
                    <button
                      type="button"
                      onClick={() => handleRemoveDatoContacto(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Propuesta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPropuesta;