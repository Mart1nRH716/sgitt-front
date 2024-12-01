import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { obtenerMaterias, actualizarPerfilAlumno, actualizarPerfilProfesor } from '../app/utils/api';

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  userType: 'alumno' | 'profesor';
  currentData: {
    areas_alumno?: Array<{id: number, nombre: string}>;
    areas_profesor?: Array<{id: number, nombre: string}>;
    materias?: Array<{id: number, nombre: string}>;
  };
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  userType,
  currentData
}) => {
  const [materias, setMaterias] = useState<Array<{id: number, nombre: string}>>([]);
  const [areas, setAreas] = useState<Array<{id: number, nombre: string}>>([]);
  const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showCustomAreaPopup, setShowCustomAreaPopup] = useState(false);
  const [customArea, setCustomArea] = useState('');
  const [nuevaArea, setNuevaArea] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState<number>(
    userType === 'profesor' ? (currentData as any).disponibilidad || 0 : 0
  );

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const materiasData = await obtenerMaterias();
        setMaterias(materiasData);
      } catch (error) {
        console.error('Error al cargar materias:', error);
      }
    };

    if (isOpen) {
      fetchMaterias();
      // Inicializar selecciones actuales
      if (userType === 'profesor') {
        setSelectedMaterias(currentData.materias?.map(m => m.id) || []);
        setSelectedAreas(currentData.areas_profesor?.map(a => a.nombre) || []);
      } else {
        //setSelectedMaterias(currentData.areas_alumno?.map(a => a.id) || []);
        setSelectedAreas(currentData.areas_alumno?.map(a => a.nombre) || []);
      }
    }
  }, [isOpen, currentData, userType]);

  const handleAddCustomArea = () => {
    if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
      setSelectedAreas([...selectedAreas, customArea.trim()]);
      setCustomArea('');
      setShowCustomAreaPopup(false);
    }
  };

  const handleAddArea = () => {
    if (nuevaArea.trim() && !selectedAreas.includes(nuevaArea.trim())) {
      setSelectedAreas([...selectedAreas, nuevaArea.trim()]);
      setNuevaArea('');
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      setShowCustomAreaPopup(true);
      return;
    }
    
    const materiaId = parseInt(value);
    if (!selectedMaterias.includes(materiaId)) {
      setSelectedMaterias([...selectedMaterias, materiaId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (userType === 'alumno' && selectedAreas.length < 3) {
        setError('Debes seleccionar al menos 3 áreas de conocimiento');
        setIsLoading(false);
        return;
      }

      

      const data = {
        areas_ids: selectedMaterias,
        areas_custom: userType === 'alumno' ? selectedAreas : undefined,
        ...(userType === 'profesor' && { areas_custom: selectedAreas,disponibilidad: disponibilidad  }),
        materias_ids: userType === 'profesor' ? selectedMaterias : undefined
      };

      if (userType === 'alumno') {
        await actualizarPerfilAlumno(data);
      } else {
        await actualizarPerfilProfesor(data);
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {userType === 'alumno' ? (
            // Sección de áreas para alumnos
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Áreas de conocimiento (mínimo 3)
              </label>
              

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Áreas de Conocimiento</h3>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={nuevaArea}
                    onChange={(e) => setNuevaArea(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nueva área de conocimiento"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>

              
               {/* Lista de áreas personalizadas */}
               <div className="space-y-2">
                  {selectedAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedAreas(selectedAreas.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                </div>
            </div>
          ) : (
            // Sección para profesores
            <>
            
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Disponibilidad</h3>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={disponibilidad}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 5) {
                          setDisponibilidad(value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Número de espacios disponibles (0-5)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Ingrese un número entre 0 y 5 para indicar su disponibilidad actual
                    </p>
                  </div>
                
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Materias</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  onChange={handleAreaChange}
                  value=""
                >
                  <option value="">Selecciona una materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>

                {/* Lista de materias seleccionadas */}
                <div className="space-y-2">
                  {selectedMaterias.map((materiaId) => {
                    const materia = materias.find(m => m.id === materiaId);
                    return materia && (
                      <div key={materiaId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{materia.nombre}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedMaterias(selectedMaterias.filter(id => id !== materiaId))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Áreas de Conocimiento</h3>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={nuevaArea}
                    onChange={(e) => setNuevaArea(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nueva área de conocimiento"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>

                {/* Lista de áreas personalizadas */}
                <div className="space-y-2">
                  {selectedAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedAreas(selectedAreas.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Pop-up para área personalizada */}
          {showCustomAreaPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Agregar área personalizada</h3>
                <input
                  type="text"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Ingresa el nombre del área"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomAreaPopup(false);
                      setCustomArea('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomArea}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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

export default EditarPerfilModal;