import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import {
  FaSchool,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaFileAlt
} from 'react-icons/fa';
import { 
  fetchAdminStats, 
  fetchAdminData, 
  deleteAdminEntity,
  updateAdminEntity,
  createAdminEntity 
} from '../app/utils/adminApi';
// Tipos para las diferentes entidades
interface Propuesta {
  id: number;
  nombre: string;
  objetivo: string;
  tipo_propuesta: string;
}

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  tipo: string;
}

interface Area {
  id: number;
  nombre: string;
}

interface StatsCard {
  title: string;
  value: number;
  change: number;
  icon: JSX.Element;
}

const TablesAdmin = () => {
  const [activeTab, setActiveTab] = useState<'propuestas' | 'usuarios' | 'areas'>('propuestas');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsCard[]>([]);

  // Configuración de los CRUDs disponibles
  const cruds = [
    { 
      id: 'propuestas', 
      name: 'Propuestas', 
      icon: <FaFileAlt className="text-3xl" />,
      columns: ['ID', 'Nombre', 'Tipo', 'Objetivo', 'Acciones']
    },
    { 
      id: 'usuarios', 
      name: 'Usuarios', 
      icon: <FaUserGraduate className="text-3xl" />,
      columns: ['ID', 'Email', 'Nombre', 'Tipo', 'Acciones']
    },
    { 
      id: 'areas', 
      name: 'Áreas', 
      icon: <FaBook className="text-3xl" />,
      columns: ['ID', 'Nombre', 'Acciones']
    }
  ];

  // Estadísticas para el panel lateral
  const statsCards: StatsCard[] = [
    {
      title: "Total Propuestas",
      value: 150,
      change: 12,
      icon: <FaFileAlt className="w-6 h-6" />
    },
    {
      title: "Usuarios Activos",
      value: 320,
      change: 5,
      icon: <FaUserGraduate className="w-6 h-6" />
    },
    {
      title: "Áreas Registradas",
      value: 45,
      change: 2,
      icon: <FaBook className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, entityData] = await Promise.all([
          fetchAdminStats(),
          fetchAdminData(activeTab, searchTerm)
        ]);
        
        // Actualizar estadísticas
        const updatedStats = [
          {
            title: "Total Propuestas",
            value: statsData.propuestas.total,
            change: statsData.propuestas.growth,
            icon: <FaFileAlt className="w-6 h-6" />
          },
          {
            title: "Usuarios Activos",
            value: statsData.users.total,
            change: statsData.users.growth,
            icon: <FaUserGraduate className="w-6 h-6" />
          },
          {
            title: "Distribución Usuario",
            value: `${statsData.users.alumnos}/${statsData.users.profesores}`,
            change: 0,
            icon: <FaBook className="w-6 h-6" />
          }
        ];
        
        setStats(updatedStats);
        setData(entityData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, searchTerm]);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      try {
        await deleteAdminEntity(activeTab, id);
        // Recargar datos después de eliminar
        const newData = await fetchAdminData(activeTab, searchTerm);
        setData(newData);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const filteredData = data.filter(item => {
    const searchValue = searchTerm.toLowerCase();
    return (
      item.nombre?.toLowerCase().includes(searchValue) ||
      item.email?.toLowerCase().includes(searchValue) ||
      item.tipo_propuesta?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header con búsqueda */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Administración de {activeTab}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} />
            Nuevo
          </button>
        </div>
      </div>

      {/* Selector de CRUD */}
      <div className="grid grid-cols-3 gap-4">
        {cruds.map((crud) => (
          <button
            key={crud.id}
            onClick={() => setActiveTab(crud.id as any)}
            className={`p-4 rounded-lg flex items-center gap-4 transition-colors ${
              activeTab === crud.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {crud.icon}
            <span className="font-medium">{crud.name}</span>
          </button>
        ))}
      </div>

      {/* Tabla de datos */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {cruds.find(c => c.id === activeTab)?.columns.map((column) => (
                  <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Cargando...</td>
                </tr>
              ) : filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                  <td className="px-6 py-4">{item.nombre || item.email}</td>
                  {activeTab === 'propuestas' && (
                    <>
                      <td className="px-6 py-4">{item.tipo_propuesta}</td>
                      <td className="px-6 py-4">{item.objetivo}</td>
                    </>
                  )}
                  {activeTab === 'usuarios' && (
                    <>
                      <td className="px-6 py-4">{item.nombre}</td>
                      <td className="px-6 py-4">{item.tipo}</td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={18} className="text-blue-500" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel lateral de estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.change > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {stat.icon}
              </div>
            </div>
            <div className={`mt-2 text-sm ${
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}% desde el último mes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesAdmin;