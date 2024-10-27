'use client';

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { actualizarPropuesta } from '../app/utils/api';

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

interface EditarPropuestaModalProps {
  propuesta: Propuesta;
  onClose: () => void;
  onUpdate: () => void;
}

const EditarPropuestaModal: React.FC<EditarPropuestaModalProps> = ({
  propuesta,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    nombre: propuesta.nombre,
    objetivo: propuesta.objetivo,
    cantidad_alumnos: propuesta.cantidad_alumnos,
    cantidad_profesores: propuesta.cantidad_profesores,
    tipo_propuesta: propuesta.tipo_propuesta,
    requisitos: propuesta.requisitos.map(req => req.descripcion),
    palabras_clave: propuesta.palabras_clave.map(pc => pc.palabra),
    areas: propuesta.areas.map(area => area.nombre),
    datos_contacto: propuesta.datos_contacto.map(dc => dc.dato),
  });

  const [nuevoRequisito, setNuevoRequisito] = useState('');
  const [nuevaPalabraClave, setNuevaPalabraClave] = useState('');
  const [nuevaArea, setNuevaArea] = useState('');
  const [nuevoDatoContacto, setNuevoDatoContacto] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequisito = () => {
    if (nuevoRequisito.trim()) {
      setFormData(prev => ({
        ...prev,
        requisitos: [...prev.requisitos, nuevoRequisito.trim()]
      }));
      setNuevoRequisito('');
    }
  };

  const handleRemoveRequisito = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index)
    }));
  };

  const handleAddPalabraClave = () => {
    if (nuevaPalabraClave.trim()) {
      setFormData(prev => ({
        ...prev,
        palabras_clave: [...prev.palabras_clave, nuevaPalabraClave.trim()]
      }));
      setNuevaPalabraClave('');
    }
  };

  const handleRemovePalabraClave = (index: number) => {
    setFormData(prev => ({
      ...prev,
      palabras_clave: prev.palabras_clave.filter((_, i) => i !== index)
    }));
  };

  const handleAddArea = () => {
    if (nuevaArea.trim()) {
      setFormData(prev => ({
        ...prev,
        areas: [...prev.areas, nuevaArea.trim()]
      }));
      setNuevaArea('');
    }
  };

  const handleRemoveArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index)
    }));
  };

  const handleAddDatoContacto = () => {
    if (nuevoDatoContacto.trim()) {
      setFormData(prev => ({
        ...prev,
        datos_contacto: [...prev.datos_contacto, nuevoDatoContacto.trim()]
      }));
      setNuevoDatoContacto('');
    }
  };

  const handleRemoveDatoContacto = (index: number) => {
    // No permitir eliminar el email por defecto (índice 0)
    if (index === 0) return;
    
    setFormData(prev => ({
      ...prev,
      datos_contacto: prev.datos_contacto.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');


    try {
        console.log('formData', formData);
      await actualizarPropuesta(propuesta.id, formData);
      onUpdate();
      onClose();
    } catch (err) {
      setError('Error al actualizar la propuesta. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Propuesta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <textarea
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Alumnos
              </label>
              <input
                type="number"
                name="cantidad_alumnos"
                value={formData.cantidad_alumnos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={1}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Profesores
              </label>
              <input
                type="number"
                name="cantidad_profesores"
                value={formData.cantidad_profesores}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Propuesta
            </label>
            <input
              type="text"
              name="tipo_propuesta"
              value={formData.tipo_propuesta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requisitos
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nuevoRequisito}
                onChange={(e) => setNuevoRequisito(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nuevo requisito"
              />
              <button
                type="button"
                onClick={handleAddRequisito}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {formData.requisitos.map((req, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{req}</span>
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

          {/* Palabras Clave */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palabras Clave
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nuevaPalabraClave}
                onChange={(e) => setNuevaPalabraClave(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nueva palabra clave"
              />
              <button
                type="button"
                onClick={handleAddPalabraClave}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.palabras_clave.map((palabra, index) => (
                <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {palabra}
                  <button
                    type="button"
                    onClick={() => handleRemovePalabraClave(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Áreas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Áreas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nuevaArea}
                onChange={(e) => setNuevaArea(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nueva área"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.areas.map((area, index) => (
                <span key={index} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Datos de Contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datos de Contacto
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nuevoDatoContacto}
                onChange={(e) => setNuevoDatoContacto(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nuevo dato de contacto"
              />
              <button
                type="button"
                onClick={handleAddDatoContacto}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {formData.datos_contacto.map((dato, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{dato}</span>
                  {index !== 0 && (
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPropuestaModal;