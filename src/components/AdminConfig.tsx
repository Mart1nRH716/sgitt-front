// src/components/AdminConfig.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Item {
  id: number;
  nombre: string;
}

const AdminConfig = () => {
  const [activeTab, setActiveTab] = useState<'areas' | 'materias'>('areas');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = activeTab === 'areas' ? 'areas' : 'materias';
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${endpoint}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleAdd = async () => {
    const itemType = activeTab === 'areas' ? 'Área' : 'Materia';
    const { value: nombre } = await Swal.fire({
      title: `Nueva ${itemType}`,
      input: 'text',
      inputLabel: 'Nombre',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => !value ? 'Debes ingresar un nombre' : null
    });

    if (nombre) {
      try {
        const token = localStorage.getItem('accessToken');
        const endpoint = activeTab === 'areas' ? 'areas' : 'materias';
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${endpoint}/`,
          { nombre },
          { headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        await fetchItems();
        Swal.fire('¡Éxito!', `${itemType} creada correctamente`, 'success');
      } catch (error) {
        console.error('Error creating item:', error);
        if (axios.isAxiosError(error) && error.response) {
          Swal.fire('Error', error.response.data.detail || `No se pudo crear la ${itemType.toLowerCase()}`, 'error');
        } else {
          Swal.fire('Error', `No se pudo crear la ${itemType.toLowerCase()}`, 'error');
        }
      }
    }
  };

  const handleEdit = async (item: Item) => {
    const itemType = activeTab === 'areas' ? 'Área' : 'Materia';
    const { value: nombre } = await Swal.fire({
      title: `Editar ${itemType}`,
      input: 'text',
      inputLabel: 'Nombre',
      inputValue: item.nombre,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => !value ? 'Debes ingresar un nombre' : null
    });

    if (nombre) {
      try {
        const token = localStorage.getItem('accessToken');
        const endpoint = activeTab === 'areas' ? 'areas' : 'materias';
        
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${endpoint}/${item.id}/`,
          { nombre },
          { headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        await fetchItems();
        Swal.fire('¡Éxito!', `${itemType} actualizada correctamente`, 'success');
      } catch (error) {
        console.error('Error updating item:', error);
        Swal.fire('Error', `No se pudo actualizar la ${itemType.toLowerCase()}`, 'error');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const itemType = activeTab === 'areas' ? 'área' : 'materia';
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta ${itemType} se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('accessToken');
        const endpoint = activeTab === 'areas' ? 'areas' : 'materias';
        
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/${endpoint}/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        await fetchItems();
        Swal.fire('¡Eliminado!', `La ${itemType} ha sido eliminada`, 'success');
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire('Error', `No se pudo eliminar la ${itemType}`, 'error');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración del Sistema</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('areas')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'areas' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Áreas de Conocimiento
        </button>
        <button
          onClick={() => setActiveTab('materias')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'materias' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Materias
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === 'areas' ? 'Áreas de Conocimiento' : 'Materias'}
          </h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Agregar {activeTab === 'areas' ? 'Área' : 'Materia'}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span>{item.nombre}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No hay {activeTab === 'areas' ? 'áreas' : 'materias'} registradas
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConfig;