import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { cambiarContraseña } from '@/app/utils/api';

interface CambiarContrasenaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PasswordFieldName = 'currentPassword' | 'newPassword' | 'confirmPassword';

const CambiarContrasenaModal: React.FC<CambiarContrasenaModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field: PasswordFieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      await cambiarContraseña({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess('Contraseña actualizada exitosamente');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderPasswordField = (
    fieldName: PasswordFieldName,
    label: string,
    placeholder: string = ''
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={showPasswords[fieldName] ? 'text' : 'password'}
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          required
          minLength={8}
          autoComplete="new-password"
         
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(fieldName)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
          tabIndex={-1}
        >
          {showPasswords[fieldName] ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-oscure mb-6">Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderPasswordField(
            'currentPassword',
            'Contraseña Actual',
            'Ingresa tu contraseña actual'
          )}
          
          {renderPasswordField(
            'newPassword',
            'Nueva Contraseña',
            'Ingresa tu nueva contraseña'
          )}
          
          {renderPasswordField(
            'confirmPassword',
            'Confirmar Nueva Contraseña',
            'Confirma tu nueva contraseña'
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasenaModal;