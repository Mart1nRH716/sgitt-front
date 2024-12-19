import React, { useEffect, useState } from "react";
import { Search, Download, Edit, Trash2, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAdminData, updateAdminItem, deleteAdminItem } from '../app/utils/api';
import axios from "axios";
import { createAdminItem } from '../app/utils/api';

interface Profesor {
  id: number;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  departamento: string;
  es_profesor: boolean;
  materias: Array<{ id: number; nombre: string }>;
  areas_profesor: Array<{ id: number; nombre: string }>;
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

interface TablesAdminProps {
  activeTab2: string;
  onTabChange?: (tab: string) => void;
}
const TablesAdmin: React.FC<TablesAdminProps> = ({ activeTab2, onTabChange }) => {
  useEffect(() => {
    if (activeTab2) {
      setActiveTab(activeTab2 as TabType);
    }
  }, [activeTab2]);
  const [activeTab, setActiveTab] = useState<TabType>('alumnos');
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [materias, setMaterias] = useState<Array<{ id: number, nombre: string }>>([]);

  const cargarMaterias = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/materias/');
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const exportToCSV = () => {
    // Agregar BOM para Excel
    const BOM = '\uFEFF';
    let csvContent = BOM;
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
    csvContent += headers.join(';') + '\n';

    // Función para escapar campos con comas y caracteres especiales
    const escapeField = (field: any) => {
      if (field === null || field === undefined) return '""';
      return `"${String(field).replace(/"/g, '""')}"`;
    };

    // Agregar datos
    filterData().forEach((item) => {
      let row: string[] = [];
      if (activeTab === 'alumnos') {
        row = [
          escapeField(item.email),
          escapeField(item.nombre),
          escapeField(item.apellido_paterno),
          escapeField(item.apellido_materno),
          escapeField(item.boleta),
          escapeField(item.carrera)
        ];
      } else if (activeTab === 'profesores') {
        row = [
          escapeField(item.email),
          escapeField(item.nombre),
          escapeField(item.apellido_paterno),
          escapeField(item.apellido_materno),
          escapeField(item.departamento || 'No asignado')
        ];
      } else {
        row = [
          escapeField(item.nombre),
          escapeField(item.tipo_propuesta),
          escapeField(item.autor?.nombre || 'No disponible'),
          escapeField(new Date(item.fecha_creacion).toLocaleDateString('es-ES'))
        ];
      }
      csvContent += row.join(';') + '\n';
    });

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_${new Date().toLocaleDateString('es-ES')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreate = async () => {
    try {
      let formFields;
      if (activeTab === 'alumnos') {
        formFields = {
          html: `
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input id="nombre" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                <input id="apellido_paterno" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                <input id="apellido_materno" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Boleta</label>
                <input id="boleta" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                <select id="carrera" class="w-full px-3 py-2 border rounded-md">
                  <option value="ISC">Sistemas Computacionales</option>
                  <option value="LCD">Ciencia de Datos</option>
                  <option value="IIA">Inteligencia Artificial</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plan de Estudios</label>
                <select id="plan_estudios" class="w-full px-3 py-2 border rounded-md">
                  <option value="2009">2009</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">¿Es administrador?</label>
                <select id="is_admin" class="w-full px-3 py-2 border rounded-md">
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
            </div>
          `
        };
      } else if (activeTab === 'profesores') {
        const materiasResponse = await axios.get(
          'http://localhost:8000/api/materias/',
        );
        const todasLasMaterias = materiasResponse.data;
        formFields = {
          html: `
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input id="nombre" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                <input id="apellido_paterno" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                <input id="apellido_materno" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select id="departamento" class="w-full px-3 py-2 border rounded-md">
                  <option value="CIC">CIC</option>
                  <option value="FB">FB</option>
                  <option value="FII">FII</option>
                  <option value="ISC">ISC</option>
                  <option value="POSGR">POSGR</option>
                  <option value="SUB ACAD">SUB ACAD</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Materias</label>
                <div class="max-h-48 overflow-y-auto border rounded-md p-2">
                  ${materias.map(materia => `
                    <div class="flex items-center gap-2 p-1">
                      <input 
                        type="checkbox" 
                        id="materia-${materia.id}" 
                        name="materias_ids[]"
                        value="${materia.id}"
                        class="materias-checkbox"
                      >
                      <label for="materia-${materia.id}">${materia.nombre}</label>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">¿Es administrador?</label>
                <select id="is_admin" class="w-full px-3 py-2 border rounded-md">
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </div>
            </div>
          `
        };
      } else {
        formFields = {
          html: `
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input id="nombre" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <textarea id="objetivo" class="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Alumnos</label>
                <input id="cantidad_alumnos" type="number" min="1" value="1" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Profesores</label>
                <input id="cantidad_profesores" type="number" min="1" value="1" class="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Propuesta</label>
                <select id="tipo_propuesta" class="w-full px-3 py-2 border rounded-md">
                  <option value="TT1">TT1</option>
                  <option value="Remedial">Remedial</option>
                </select>
              </div>
            </div>
          `
        };
      }

      const result = await Swal.fire({
        title: 'Crear Nuevo',
        html: formFields.html,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const values: any = {};

          if (activeTab === 'alumnos') {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.apellido_paterno = (document.getElementById('apellido_paterno') as HTMLInputElement).value;
            values.apellido_materno = (document.getElementById('apellido_materno') as HTMLInputElement).value;
            values.email = (document.getElementById('email') as HTMLInputElement).value;
            values.boleta = (document.getElementById('boleta') as HTMLInputElement).value;
            values.carrera = (document.getElementById('carrera') as HTMLSelectElement).value;
            values.plan_estudios = (document.getElementById('plan_estudios') as HTMLSelectElement).value;
            values.password = (document.getElementById('password') as HTMLInputElement).value;
            values.is_admin = (document.getElementById('is_admin') as HTMLSelectElement).value;
            values.confirmPassword = values.password;
          } else if (activeTab === 'profesores') {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.apellido_paterno = (document.getElementById('apellido_paterno') as HTMLInputElement).value;
            values.apellido_materno = (document.getElementById('apellido_materno') as HTMLInputElement).value;
            values.email = (document.getElementById('email') as HTMLInputElement).value;
            values.departamento = (document.getElementById('departamento') as HTMLSelectElement).value;
            values.password = (document.getElementById('password') as HTMLInputElement).value;
            values.is_admin = (document.getElementById('is_admin') as HTMLSelectElement).value;
            const materiasCheckboxes = document.querySelectorAll('.materias-checkbox:checked');
            values.materias_ids = Array.from(materiasCheckboxes).map(
              (checkbox: any) => parseInt(checkbox.value)
            );
            values.es_profesor = true;
          } else {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.objetivo = (document.getElementById('objetivo') as HTMLTextAreaElement).value;
            values.cantidad_alumnos = parseInt((document.getElementById('cantidad_alumnos') as HTMLInputElement).value);
            values.cantidad_profesores = parseInt((document.getElementById('cantidad_profesores') as HTMLInputElement).value);
            values.tipo_propuesta = (document.getElementById('tipo_propuesta') as HTMLSelectElement).value;
            values.visible = true;
          }

          return values;
        }
      });

      if (result.isConfirmed && result.value) {
        const newItem = await createAdminItem(activeTab, {
          ...result.value,
          is_admin: result.value.is_admin
        });
        await fetchData();
        Swal.fire('¡Creado!', 'El elemento ha sido creado exitosamente.', 'success');
      }
    } catch (error) {
      console.error('Error al crear:', error);
      let errorMessage = 'No se pudo crear el elemento';
      // if (axios.isAxiosError(error)) {
      //   errorMessage += `: ${error.response?.status} - ${error.response?.statusText}`;
      // }
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleEdit = async (item: any) => {
    try {

      const itemId = activeTab === 'alumnos' ? item.id : item.id;

      console.log('Item completo a editar:', item);
      console.log('ID del item:', item.id);
      console.log('Tipo activo:', activeTab);



      let formFields;
      if (activeTab === 'alumnos') {
        formFields = {
          html: `
          <div class="grid grid-cols-1 gap-4">
          <input type="hidden" id="user_id" value="${itemId}" />
          <input type="hidden" id="password" value="${item.password}" />
          <input type="hidden" id="confirmPassword" value="${item.password}" />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input id="nombre" class="w-full px-3 py-2 border rounded-md" value="${item.nombre || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input id="apellido_paterno" class="w-full px-3 py-2 border rounded-md" value="${item.apellido_paterno || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input id="apellido_materno" class="w-full px-3 py-2 border rounded-md" value="${item.apellido_materno || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" value="${item.email || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Boleta</label>
              <input id="boleta" class="w-full px-3 py-2 border rounded-md" value="${item.boleta || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
              <select id="carrera" class="w-full px-3 py-2 border rounded-md">
                <option value="ISC" ${item.carrera === 'ISC' ? 'selected' : ''}>Sistemas Computacionales</option>
                <option value="LCD" ${item.carrera === 'LCD' ? 'selected' : ''}>Ciencia de Datos</option>
                <option value="IIA" ${item.carrera === 'IIA' ? 'selected' : ''}>Inteligencia Artificial</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Plan de Estudios</label>
              <select id="plan_estudios" class="w-full px-3 py-2 border rounded-md">
                <option value="2009" ${item.plan_estudios === '2009' ? 'selected' : ''}>2009</option>
                <option value="2020" ${item.plan_estudios === '2020' ? 'selected' : ''}>2020</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">¿Es administrador?</label>
              <select id="is_admin" class="w-full px-3 py-2 border rounded-md">
                <option value="false" ${!item.is_admin ? 'selected' : ''}>No</option>
                <option value="true" ${item.is_admin ? 'selected' : ''}>Sí</option>
              </select>
            </div>
          </div>
        `
        };
      } else if (activeTab === 'profesores') {
        const materiasResponse = await axios.get(
          'http://localhost:8000/api/materias/',
        );
        const todasLasMaterias = materiasResponse.data;
        formFields = {
          html: `
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input id="nombre" class="w-full px-3 py-2 border rounded-md" value="${item.nombre || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input id="apellido_paterno" class="w-full px-3 py-2 border rounded-md" value="${item.apellido_paterno || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input id="apellido_materno" class="w-full px-3 py-2 border rounded-md" value="${item.apellido_materno || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" value="${item.email || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select id="departamento" class="w-full px-3 py-2 border rounded-md">
                <option value="CIC" ${item.departamento === 'CIC' ? 'selected' : ''}>CIC</option>
                <option value="FB" ${item.departamento === 'FB' ? 'selected' : ''}>FB</option>
                <option value="FII" ${item.departamento === 'FII' ? 'selected' : ''}>FII</option>
                <option value="ISC" ${item.departamento === 'ISC' ? 'selected' : ''}>ISC</option>
                <option value="POSGR" ${item.departamento === 'POSGR' ? 'selected' : ''}>POSGR</option>
                <option value="SUB ACAD" ${item.departamento === 'SUB ACAD' ? 'selected' : ''}>SUB ACAD</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Materias</label>
              <div class="max-h-48 overflow-y-auto border rounded-md p-2">
                ${todasLasMaterias.map((materia: { id: number; nombre: string }) => `
                  <div class="flex items-center gap-2 p-1">
                    <input 
                      type="checkbox" 
                      id="materia-${materia.id}" 
                      value="${materia.id}"
                      ${item.materias?.some((m: any) => m.id === materia.id) ? 'checked' : ''}
                    >
                    <label for="materia-${materia.id}">${materia.nombre}</label>
                  </div>
                `).join('')}
              </div>
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">¿Es administrador?</label>
            <select id="is_admin" class="w-full px-3 py-2 border rounded-md">
              <option value="false" ${!item.is_admin ? 'selected' : ''}>No</option>
              <option value="true" ${item.is_admin ? 'selected' : ''}>Sí</option>
            </select>
          </div>
          </div>
        `
        };
      } else {
        formFields = {
          html: `
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input id="nombre" class="w-full px-3 py-2 border rounded-md" value="${item.nombre || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
              <textarea id="objetivo" class="w-full px-3 py-2 border rounded-md" rows="3">${item.objetivo || ''}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Alumnos</label>
              <input id="cantidad_alumnos" type="number" min="1" class="w-full px-3 py-2 border rounded-md" value="${item.cantidad_alumnos || 1}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Profesores</label>
              <input id="cantidad_profesores" type="number" min="1" class="w-full px-3 py-2 border rounded-md" value="${item.cantidad_profesores || 1}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Propuesta</label>
              <select id="tipo_propuesta" class="w-full px-3 py-2 border rounded-md">
                <option value="TT1" ${item.tipo_propuesta === 'TT1' ? 'selected' : ''}>TT1</option>
                <option value="Remedial" ${item.tipo_propuesta === 'Remedial' ? 'selected' : ''}>Remedial</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Visible</label>
              <select id="visible" class="w-full px-3 py-2 border rounded-md">
                <option value="true" ${item.visible ? 'selected' : ''}>Sí</option>
                <option value="false" ${!item.visible ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>
        `
        };
      }

      const result = await Swal.fire({
        title: 'Editar',
        html: formFields.html,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const values: any = {};

          if (activeTab === 'alumnos') {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.apellido_paterno = (document.getElementById('apellido_paterno') as HTMLInputElement).value;
            values.apellido_materno = (document.getElementById('apellido_materno') as HTMLInputElement).value;
            values.email = (document.getElementById('email') as HTMLInputElement).value;
            values.boleta = (document.getElementById('boleta') as HTMLInputElement).value;
            values.carrera = (document.getElementById('carrera') as HTMLSelectElement).value;
            values.plan_estudios = (document.getElementById('plan_estudios') as HTMLSelectElement).value;
            values.password = (document.getElementById('password') as HTMLInputElement).value;
            values.confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
            values.is_admin = (document.getElementById('is_admin') as HTMLSelectElement).value === 'true';
            values.user = {
              email: values.email,
              first_name: values.nombre,
              last_name: values.apellido_paterno
            };
          } else if (activeTab === 'profesores') {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.apellido_paterno = (document.getElementById('apellido_paterno') as HTMLInputElement).value;
            values.apellido_materno = (document.getElementById('apellido_materno') as HTMLInputElement).value;
            values.email = (document.getElementById('email') as HTMLInputElement).value;
            values.departamento = (document.getElementById('departamento') as HTMLSelectElement).value;
            values.is_admin = (document.getElementById('is_admin') as HTMLSelectElement).value === 'true';
            values.materias_ids = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
              .map((cb: any) => parseInt(cb.value))
            values.user = {
              email: values.email,
              first_name: values.nombre,
              last_name: values.apellido_paterno
            };
          } else if (activeTab === 'propuestas') {
            values.nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            values.objetivo = (document.getElementById('objetivo') as HTMLTextAreaElement).value;
            values.cantidad_alumnos = parseInt((document.getElementById('cantidad_alumnos') as HTMLInputElement).value);
            values.cantidad_profesores = parseInt((document.getElementById('cantidad_profesores') as HTMLInputElement).value);
            values.tipo_propuesta = (document.getElementById('tipo_propuesta') as HTMLSelectElement).value;
            values.visible = (document.getElementById('visible') as HTMLSelectElement).value === 'true';
          }

          return values;
        }
      });

      if (result.isConfirmed && result.value) {
        console.log('Datos a enviar en la actualización:', {
          ...result.value,
          user_id: itemId
        });
        const updatedItem = await updateAdminItem(activeTab, itemId, result.value);
        console.log('Respuesta de la actualización:', updatedItem);

        await fetchData();
        Swal.fire('¡Actualizado!', 'Los cambios han sido guardados.', 'success');
      }
    } catch (error) {
      console.error('Error al editar:', error);
      let errorMessage = 'No se pudieron guardar los cambios';
      // if (axios.isAxiosError(error)) {
      //   errorMessage += `: ${error.response?.status} - ${error.response?.statusText}`;
      //   console.log('Detalles del error:', error.response?.data);
      // }
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Intentando eliminar item:', {
        tipo: activeTab,
        id: id
      });

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
        console.log('Procediendo con la eliminación...');
        await deleteAdminItem(activeTab, id);
        console.log('Eliminación completada');
        await fetchData();
        Swal.fire('¡Eliminado!', 'El elemento ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error en la eliminación:', error);
      let errorMessage = 'No se pudo eliminar el elemento';
      // if (axios.isAxiosError(error)) {
      //   errorMessage += `: ${error.response?.status} - ${error.response?.statusText}`;
      //   console.log('Detalles del error:', error.response?.data);
      // }
      Swal.fire('Error', errorMessage, 'error');
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
    cargarMaterias();
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
          className={`px-4 py-2 rounded-lg ${activeTab === 'alumnos' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
        >
          Alumnos
        </button>
        <button
          onClick={() => setActiveTab('profesores')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'profesores' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
        >
          Profesores
        </button>
        <button
          onClick={() => setActiveTab('propuestas')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'propuestas' ? 'bg-primary text-white' : 'bg-gray-200'
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
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Crear Nuevo</span>
        </button>
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
                          onClick={() => {
                            // Asegurarse de que el ID esté disponible
                            const alumnoId = item.user?.id || item.id;
                            console.log('ID del alumno a editar:', alumnoId);
                            console.log('Datos completos del alumno:', item);
                            handleEdit({
                              ...item,
                              id: alumnoId
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Editar alumno"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const alumnoId = item.id || item.user?.id;
                            console.log('ID del alumno a eliminar:', alumnoId);
                            handleDelete(alumnoId);
                          }}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Eliminar alumno"
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