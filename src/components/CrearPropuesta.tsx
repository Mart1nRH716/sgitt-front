'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { crearPropuesta } from '../app/utils/api';
import { useRouter } from 'next/navigation';

interface PropuestaForm {
    nombre: string;
    objetivo: string;
    cantidad_alumnos: number;
    cantidad_profesores: number;
    requisitos: string[];
    palabras_clave: string[];
    areas: string[];
  }
  
  const CrearPropuesta: React.FC = () => {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const [propuesta, setPropuesta] = useState<PropuestaForm>({
      nombre: '',
      objetivo: '',
      cantidad_alumnos: 1,
      cantidad_profesores: 1,
      requisitos: [],
      palabras_clave: [],
      areas: [],
    });
    const [nuevoRequisito, setNuevoRequisito] = useState('');
    const [nuevaPalabraClave, setNuevaPalabraClave] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nuevaArea, setNuevaArea] = useState('');
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPropuesta(prev => ({ ...prev, [name]: value }));
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
  
    const handleAddPalabraClave = () => {
      if (nuevaPalabraClave.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          palabras_clave: [...prev.palabras_clave, nuevaPalabraClave.trim()]
        }));
        setNuevaPalabraClave('');
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

    const handleAddArea = () => {
      if (nuevaArea.trim() !== '') {
        setPropuesta(prev => ({
          ...prev,
          areas: [...prev.areas, nuevaArea.trim()]
        }));
        setNuevaArea('');
      }
    };
  
    const handleRemoveArea = (index: number) => {
      setPropuesta(prev => ({
        ...prev,
        areas: prev.areas.filter((_, i) => i !== index)
      }));
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await crearPropuesta(propuesta);
      console.log('Propuesta creada:', response);
      setSuccess(true);
      setTimeout(() => {
        router.push('/perfil/mispropuestas');
      }, 2000);
    } catch (error) {
      console.error('Error al crear la propuesta:', error);
      setError('Hubo un error al crear la propuesta. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={nuevoRequisito}
                onChange={(e) => setNuevoRequisito(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Áreas de Conocimiento</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={nuevaArea}
              onChange={(e) => setNuevaArea(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nueva área de conocimiento"
            />
            <button
              type="button"
              onClick={handleAddArea}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {propuesta.areas.map((area, index) => (
              <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArea(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Palabras Clave</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={nuevaPalabraClave}
                onChange={(e) => setNuevaPalabraClave(e.target.value)}
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