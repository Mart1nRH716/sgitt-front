import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';

interface Option {
  id: number;
  nombre: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar áreas...",
  searchPlaceholder = "Buscar área..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some(item => item.id === option.id);
    if (isSelected) {
      onChange(value.filter(item => item.id !== option.id));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (optionToRemove: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(option => option.id !== optionToRemove.id));
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`min-h-[42px] px-3 py-2 border rounded-md bg-white cursor-pointer
        ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}
        hover:border-primary transition-colors duration-200`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            value.map(option => (
              <span
                key={option.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {option.nombre}
                <button
                  onClick={(e) => removeOption(option, e)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
        </div>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-center">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = value.some(item => item.id === option.id);
                return (
                  <div
                    key={option.id}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between
                    hover:bg-gray-50 transition-colors duration-150
                    ${isSelected ? 'bg-primary/5 text-primary' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span>{option.nombre}</span>
                    {isSelected && <Check size={16} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;