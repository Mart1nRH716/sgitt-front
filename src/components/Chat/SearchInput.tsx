// src/components/Chat/SearchInput.tsx
import React, { useState, useEffect } from 'react';
import { Search, Mail, User, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  isSearching,
  placeholder = "Buscar usuarios..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'email' | 'name' | 'id'>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none text-gray-700"
        />
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 text-sm text-gray-600">
        <button
          onClick={() => setSearchType('all')}
          className={`px-3 py-1 rounded-full ${
            searchType === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSearchType('email')}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            searchType === 'email' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={() => setSearchType('name')}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            searchType === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          Nombre
        </button>
        <button
          onClick={() => setSearchType('id')}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            searchType === 'id' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Hash className="w-4 h-4" />
          Boleta/Matrícula
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        <p>Ejemplos de búsqueda:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Por nombre: "Juan Pérez", "Juan", "Pérez"</li>
          <li>Por correo: "juan@example.com", "@ipn.mx"</li>
          <li>Por boleta/matrícula: "2020630000", "PE12345"</li>
        </ul>
      </div>
    </div>
  );
};