"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { register ,obtenerMaterias  } from '../app/utils/api';
import { useRouter } from 'next/navigation';

interface Area {
  id: number;
  nombre: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    boleta: '',
    email: '',
    carrera: '',
    plan_estudios: '',
    password: '',
    confirmPassword: '',
    areas_ids: [] as number[],
    areas_custom: [] as string[]
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [customArea, setCustomArea] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [areaError, setAreaError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showCustomAreaPopup, setShowCustomAreaPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasData = await obtenerMaterias();
        setAreas(areasData);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
      }
    };
    fetchAreas();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setAreaError('');
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    const totalAreas = formData.areas_ids.length + formData.areas_custom.length;
    if (totalAreas < 3) {
      setAreaError('Debes seleccionar o agregar al menos 3 áreas de conocimiento');
      return;
    }

    try {
      const response = await register(formData);
      console.log(response);
      setRegistrationSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (error) {
      console.error(error);
      setError('Error al registrar. Por favor, intente nuevamente.');
    }
  }, [formData, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleAreaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      setShowCustomAreaPopup(true);
      e.target.value = ''; // Reset select value
      return;
    }
    
    const areaId = parseInt(value);
    if (!formData.areas_ids.includes(areaId)) {
      setFormData(prevData => ({
        ...prevData,
        areas_ids: [...prevData.areas_ids, areaId]
      }));
    }
  }, [formData.areas_ids]);

  const handleAddCustomArea = () => {
    if (customArea.trim() && !formData.areas_custom.includes(customArea.trim())) {
      setFormData(prevData => ({
        ...prevData,
        areas_custom: [...prevData.areas_custom, customArea.trim()]
      }));
      setCustomArea('');
      setShowCustomAreaPopup(false);
    }
  };

  const removeArea = (id: number) => {
    setFormData(prevData => ({
      ...prevData,
      areas_ids: prevData.areas_ids.filter(areaId => areaId !== id)
    }));
  };

  const removeCustomArea = (area: string) => {
    setFormData(prevData => ({
      ...prevData,
      areas_custom: prevData.areas_custom.filter(customArea => customArea !== area)
    }));
  };

  useEffect(() => {
    if (formData.password === formData.confirmPassword) {
      setPasswordError('');
    } else if (formData.confirmPassword !== '') {
      setPasswordError('Las contraseñas no coinciden');
    }
  }, [formData.password, formData.confirmPassword]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
        {registrationSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">¡Registro Exitoso!</h2>
            <p className="mb-4">Se ha enviado un correo de verificación a tu dirección de email.</p>
            <p>Por favor, verifica tu correo para activar tu cuenta.</p>
            <p className="mt-4 text-sm text-gray-500">Serás redirigido a la página de inicio en 5 segundos...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Registro</h2>
            <p className="text-center text-gray-600 mb-8">Crea una nueva cuenta</p>
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="apellido_paterno" className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
            <input
              id="apellido_paterno"
              name="apellido_paterno"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.apellido_paterno}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="apellido_materno" className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
            <input
              id="apellido_materno"
              name="apellido_materno"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.apellido_materno}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="boleta" className="block text-sm font-medium text-gray-700 mb-1">Boleta</label>
            <input
              id="boleta"
              name="boleta"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.boleta}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          {/* Nuevos campos de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          {passwordError && (
            <div className="text-red-500 text-sm">{passwordError}</div>
          )}
          
          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
            <select
              id="carrera"
              name="carrera"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.carrera}
              onChange={handleChange}
            >
              <option value="">Selecciona una carrera</option>
              <option value="ISC">Sistemas Computacionales</option>
              <option value="LCD">Licenciatura en Ciencia de Datos</option>
              <option value="IIA">Inteligencia Artificial</option>
            </select>
          </div>
          <div>
            <label htmlFor="plan_estudios" className="block text-sm font-medium text-gray-700 mb-1">Plan de estudios</label>
            <select
              id="plan_estudios"
              name="plan_estudios"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.plan_estudios}
              onChange={handleChange}
            >
              <option value="">Selecciona un plan</option>
              <option value="2009">2009</option>
              <option value="2020">2020</option>
            </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Áreas de conocimiento (mínimo 3)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                onChange={handleAreaChange}
                value=""
              >
                <option value="">Selecciona un área</option>
                <option value="other">Otra área...</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>

              {/* Popup para área personalizada */}
              {showCustomAreaPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-semibold mb-4">Agregar área personalizada</h3>
                    <input
                      type="text"
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
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

              {/* Mostrar áreas seleccionadas */}
              <div className="space-y-2">
                {formData.areas_ids.map(areaId => {
                  const area = areas.find(a => a.id === areaId);
                  return area ? (
                    <div key={area.id} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <span>{area.nombre}</span>
                      <button
                        type="button"
                        onClick={() => removeArea(area.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
                {formData.areas_custom.map(area => (
                  <div key={area} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomArea(area)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {areaError && (
                <p className="text-red-500 text-sm mt-1">{areaError}</p>
              )}
            </div>
          {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Registrarse
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;