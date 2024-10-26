import React from 'react';
import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  nombre: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  isOpen,
  nombre
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            ¿Estás seguro que deseas eliminar la propuesta "{nombre}"?
          </p>
          <p className="text-red-500 text-sm mt-2">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;