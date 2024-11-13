// src/components/Chat/CreateChatDialog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Search, UserPlus, Users, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthService from '@/app/utils/authService';
import { debounce } from 'lodash';



interface UserType {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

interface CreateChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: { id: number; name: string; is_group: boolean; participants: UserType[] }) => void;
}

const CreateChatDialog: React.FC<CreateChatDialogProps> = ({
  isOpen,
  onClose,
  onConversationCreated
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Limpiar estados cuando se cierra el diálogo
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUsers([]);
      setIsGroup(false);
      setGroupName('');
      setError(null);
    }
  }, [isOpen]);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Obtener un token válido
      const token = await AuthService.getValidToken();
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Searching with query:', query);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/usuarios/search/?q=${encodeURIComponent(query)}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Search response:', response.data);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error('Error searching users:', error);
      
      if (error.response?.status === 401) {
        // Si aún recibimos 401 después de intentar refrescar el token,
        // redirigir al login
        router.push('/login');
        return;
      }
      
      setError(error.response?.data?.detail || 'Error al buscar usuarios');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Función debounce para la búsqueda
  const debouncedSearch = useCallback(
    debounce((query: string) => searchUsers(query), 300),
    []
  );

  // useEffect para limpiar el debounce al desmontar
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleCreateConversation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8000/api/chat/conversations/create_or_get_conversation/',
        {
          participant_ids: selectedUsers.map(user => user.id),
          name: isGroup ? groupName : '',
          is_group: isGroup
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      onConversationCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Error al crear la conversación');
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8000/api/usuarios/search/?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Error al buscar usuarios');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  const isCreateButtonDisabled = 
    selectedUsers.length === 0 || 
    (isGroup && !groupName.trim()) ||
    (!isGroup && selectedUsers.length !== 1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nueva Conversación</h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
      
            {/* Grupo checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGroup}
                  onChange={(e) => setIsGroup(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2" />
                  Crear grupo
                </span>
              </label>
            </div>
      
            {/* Nombre del grupo (si es grupo) */}
            {isGroup && (
              <div className="mb-4">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Nombre del grupo"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
      
            {/* Buscador */}
            <div className="relative mb-4">
              <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  placeholder="Buscar usuarios por nombre, correo o boleta..."
                  className="w-full outline-none"
                />
              </div>
      
              {/* Texto de ayuda */}
              <div className="text-xs text-gray-500 mt-1 px-2">
                <p>Puedes buscar por:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nombre o apellidos</li>
                  <li>Correo electrónico</li>
                  <li>Número de boleta</li>
                </ul>
              </div>
      
              {/* Usuarios seleccionados */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 animate-fadeIn"
                    >
                      <span>{user.full_name || user.email}</span>
                      <button
                        onClick={() => setSelectedUsers(users => users.filter(u => u.id !== user.id))}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
      
              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                      onClick={() => {
                        if (!selectedUsers.some(u => u.id === user.id)) {
                          setSelectedUsers([...selectedUsers, user]);
                          setSearchTerm('');
                          setSearchResults([]);
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.full_name || `${user.first_name} ${user.last_name}`}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {!selectedUsers.some(u => u.id === user.id) && (
                        <UserPlus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}
      
              {/* Estado de carga */}
              {isSearching && (
                <div className="mt-2 text-gray-600 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                  Buscando...
                </div>
              )}
      
              {/* Mensaje de error */}
              {error && (
                <div className="mt-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                  {error}
                </div>
              )}
            </div>
      
            {/* Botones de acción */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0 || (isGroup && !groupName.trim())}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedUsers.length === 0 || (isGroup && !groupName.trim())
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      );
};

export default CreateChatDialog;