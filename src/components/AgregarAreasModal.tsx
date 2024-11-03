// src/components/AgregarAreasModal.tsx

import React, { useState } from 'react';
import { X, PlusCircle, Info } from 'lucide-react';
import { actualizarPerfilProfesor } from '../app/utils/api';

interface AgregarAreasModalProps {
  onSkip: () => void;
  onComplete: () => void;
}

const AgregarAreasModal: React.FC<AgregarAreasModalProps> = ({ onSkip, onComplete }) => {
  const [customAreas, setCustomAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddArea = () => {
    if (newArea.trim() && !customAreas.includes(newArea.trim())) {
      setCustomAreas([...customAreas, newArea.trim()]);
      setNewArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setCustomAreas(customAreas.filter(a => a !== area));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddArea();
    }
  };

  const handleSubmit = async () => {
    if (customAreas.length === 0) {
      setError('Agrega al menos un área de conocimiento');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await actualizarPerfilProfesor({
        areas_custom: customAreas
      });
      onComplete();
    } catch (error) {
      setError('Error al guardar las áreas de conocimiento');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Áreas de Conocimiento</h2>
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <Info className="text-blue-500 mr-2 mt-1" size={20} />
              <div>
                <p className="text-sm text-blue-700">
                  Agregar áreas de conocimiento ayudará a los alumnos a encontrarte más fácilmente 
                  cuando busquen profesores para sus trabajos terminales.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Puedes modificar esta información más tarde en "Mi perfil" → "Editar perfil".
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input para nuevas áreas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Áreas de conocimiento
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ej: Inteligencia Artificial, Base de Datos, Redes..."
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de áreas agregadas */}
          {customAreas.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Áreas agregadas:</h3>
              <div className="flex flex-wrap gap-2">
                {customAreas.map((area, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {area}
                    <button
                      onClick={() => handleRemoveArea(area)}
                      className="hover:text-blue-600"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Lo haré después
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || customAreas.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarAreasModal;