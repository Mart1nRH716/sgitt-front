import React, { useEffect, useState } from "react";
import { Search, Download, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAdminData, updateAdminItem, deleteAdminItem } from '../app/utils/api';

interface Profesor {
  id: number;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  departamento: string;
  es_profesor: boolean;
  materias: Array<{id: number; nombre: string}>;
  areas_profesor: Array<{id: number; nombre: string}>;
  primer_inicio: boolean;
}

interface Alumno {
  id: number;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  boleta: string;
  carrera: string;
  plan_estudios: string;
}

interface Propuesta {
  id: number;
  nombre: string;
  objetivo: string;
  tipo_propuesta: string;
  autor: {
    nombre: string;
    email: string;
    tipo: string;
  };
  fecha_creacion: string;
  visible: boolean;
}

type TabType = 'alumnos' | 'profesores' | 'propuestas';

const TablesAdmin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('alumnos');
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const exportToCSV = () => {
    let csvContent = '';
    let headers: string[] = [];
    
    // Definir headers según el tab activo
    if (activeTab === 'alumnos') {
      headers = ['Email', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Boleta', 'Carrera'];
    } else if (activeTab === 'profesores') {
      headers = ['Email', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Departamento'];
    } else {
      headers = ['Nombre', 'Tipo', 'Autor', 'Fecha'];
    }

    // Agregar headers
    csvContent += headers.join(',') + '\n';

    // Agregar datos
    filterData().forEach((item) => {
      let row: string[] = [];
      if (activeTab === 'alumnos') {
        row = [
          item.email,
          item.nombre,
          item.apellido_paterno,
          item.apellido_materno,
          item.boleta,
          item.carrera
        ];
      } else if (activeTab === 'profesores') {
        row = [
          item.email,
          item.nombre,
          item.apellido_paterno,
          item.apellido_materno,
          item.departamento || 'No asignado'
        ];
      } else {
        row = [
          item.nombre,
          item.tipo_propuesta,
          item.autor?.nombre || 'No disponible',
          new Date(item.fecha_creacion).toLocaleDateString()
        ];
      }
      csvContent += row.join(',') + '\n';
    });

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = async (item: any) => {
    try {
      const formFields = generateFormFields(item);
      const { value: formValues } = await Swal.fire({
        title: 'Editar',
        html: formFields.html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => formFields.getValues()
      });

      if (formValues) {
        await updateAdminItem(activeTab, item.id, formValues);
        await fetchData();
        await Swal.fire('¡Actualizado!', 'Los cambios han sido guardados.', 'success');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await deleteAdminItem(activeTab, id);
        await fetchData();
        await Swal.fire('¡Eliminado!', 'El elemento ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire('Error', 'No se pudo eliminar el elemento', 'error');
    }
  };

  const generateFormFields = (item: any) => {
    if (activeTab === 'alumnos') {
      return {
        html: `
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.email}">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input id="nombre" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.nombre}">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Boleta</label>
            <input id="boleta" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.boleta}">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Carrera</label>
            <select id="carrera" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="ISC" ${item.carrera === 'ISC' ? 'selected' : ''}>Ing. en Sistemas Computacionales</option>
              <option value="LCD" ${item.carrera === 'LCD' ? 'selected' : ''}>Lic. en Ciencia de Datos</option>
              <option value="IIA" ${item.carrera === 'IIA' ? 'selected' : ''}>Ing. en Inteligencia Artificial</option>
            </select>
          </div>
        `,
        getValues: () => ({
          email: (document.getElementById('email') as HTMLInputElement).value,
          nombre: (document.getElementById('nombre') as HTMLInputElement).value,
          boleta: (document.getElementById('boleta') as HTMLInputElement).value,
          carrera: (document.getElementById('carrera') as HTMLSelectElement).value,
        })
      };
    }

    if (activeTab === 'profesores') {
      return {
        html: `
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.email}">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input id="nombre" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.nombre}">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Departamento</label>
            <input id="departamento" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.departamento}">
          </div>
        `,
        getValues: () => ({
          email: (document.getElementById('email') as HTMLInputElement).value,
          nombre: (document.getElementById('nombre') as HTMLInputElement).value,
          departamento: (document.getElementById('departamento') as HTMLInputElement).value,
        })
      };
    }

    return {
      html: `
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input id="nombre" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value="${item.nombre}">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Tipo</label>
          <select id="tipo_propuesta" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="TT1" ${item.tipo_propuesta === 'TT1' ? 'selected' : ''}>TT1</option>
            <option value="TT2" ${item.tipo_propuesta === 'TT2' ? 'selected' : ''}>TT2</option>
            <option value="Remedial" ${item.tipo_propuesta === 'Remedial' ? 'selected' : ''}>Remedial</option>
          </select>
        </div>
      `,
      getValues: () => ({
        nombre: (document.getElementById('nombre') as HTMLInputElement).value,
        tipo_propuesta: (document.getElementById('tipo_propuesta') as HTMLSelectElement).value,
      })
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAdminData(activeTab);
      console.log(`Datos de ${activeTab}:`, response);
      console.log('Estructura del primer item:', response[0]);
      
      if (!Array.isArray(response)) {
        console.error('La respuesta no es un array:', response);
        setData([]);
        setError('Error en el formato de datos');
        return;
      }
      
      setData(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const filterData = () => {
    if (!data || !Array.isArray(data)) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    return data.filter((item: any) => {
      if (activeTab === 'profesores') {
        return (
          item.email?.toLowerCase().includes(searchLower) ||
          item.nombre?.toLowerCase().includes(searchLower) ||
          item.apellido_paterno?.toLowerCase().includes(searchLower) ||
          item.departamento?.toLowerCase().includes(searchLower)
        );
      }
      
      if (activeTab === 'alumnos') {
        return (
          item.email?.toLowerCase().includes(searchLower) ||
          item.nombre?.toLowerCase().includes(searchLower) ||
          item.apellido_paterno?.toLowerCase().includes(searchLower) ||
          item.boleta?.toLowerCase().includes(searchLower)
        );
      }
      
      if (activeTab === 'propuestas') {
        return (
          item.nombre?.toLowerCase().includes(searchLower) ||
          item.objetivo?.toLowerCase().includes(searchLower) ||
          item.autor?.nombre?.toLowerCase().includes(searchLower) ||
          item.autor?.email?.toLowerCase().includes(searchLower)
        );
      }
      
      return false;
    });
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('alumnos')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'alumnos' ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
        >
          Alumnos
        </button>
        <button
          onClick={() => setActiveTab('profesores')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profesores' ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
        >
          Profesores
        </button>
        <button
          onClick={() => setActiveTab('propuestas')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'propuestas' ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
        >
          Propuestas
        </button>
      </div>

      {/* Barra de búsqueda y exportación */}
      <div className="flex mb-6 gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          title="Exportar a CSV"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab === 'alumnos' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boleta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </>
              )}
              {activeTab === 'profesores' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </>
              )}
              {activeTab === 'propuestas' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : (
              filterData().map((item: any) => (
                <tr key={item.id}>
                  {activeTab === 'alumnos' && (
                    <>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">
                        {`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}
                      </td>
                      <td className="px-6 py-4">{item.boleta}</td>
                      <td className="px-6 py-4">{item.carrera}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Editar alumno"
                          aria-label="Editar alumno"
                        >
                          <Edit size={18} />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Eliminar alumno"
                          aria-label="Eliminar alumno"
                        >
                          <Trash2 size={18} />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === 'profesores' && (
                    <>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">
                        {`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}
                      </td>
                      <td className="px-6 py-4">{item.departamento || 'No asignado'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Editar profesor"
                          aria-label="Editar profesor"
                        >
                          <Edit size={18} />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Eliminar profesor"
                          aria-label="Eliminar profesor"
                        >
                          <Trash2 size={18} />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === 'propuestas' && (
                    <>
                      <td className="px-6 py-4">{item.nombre}</td>
                      <td className="px-6 py-4">{item.tipo_propuesta}</td>
                      <td className="px-6 py-4">{item.autor?.nombre || 'No disponible'}</td>
                      <td className="px-6 py-4">
                        {item.fecha_creacion ? 
                          new Date(item.fecha_creacion).toLocaleDateString() : 
                          'No disponible'
                        }
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Editar propuesta"
                          aria-label="Editar propuesta"
                        >
                          <Edit size={18} />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Eliminar propuesta"
                          aria-label="Eliminar propuesta"
                        >
                          <Trash2 size={18} />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && filterData().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron resultados
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesAdmin;