'use client';
import { useState, useEffect, useCallback } from 'react';
import { register, obtenerMaterias } from '../app/utils/api';
import { useRouter } from 'next/navigation';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  BackButton,
  Logo
} from './AuthComponents';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  UserPlus,
  BookOpen,
  GraduationCap,
  FileText,
  Hash,
  PlusCircle,
  X
} from 'lucide-react';

interface Area {
  id: number;
  nombre: string;
}

const Registro = () => {
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

  const [currentStep, setCurrentStep] = useState(1);
  const [areas, setAreas] = useState<Area[]>([]);
  const [customArea, setCustomArea] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomAreaPopup, setShowCustomAreaPopup] = useState(false);
  const router = useRouter();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      await register(formData);
      setRegistrationSuccess(true); // Marcar el registro como exitoso
      setTimeout(() => {
        router.push('/login');
      }, 10000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el registro.Revisa el llenado de los campos o asegurate de que tu contraseña cumple los requisitos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomArea = () => {
    if (customArea.trim() && !formData.areas_custom.includes(customArea.trim())) {
      setFormData(prev => ({
        ...prev,
        areas_custom: [...prev.areas_custom, customArea.trim()]
      }));
      setCustomArea('');
      setShowCustomAreaPopup(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      if (name === 'carrera') {
        if (value === 'LCD' || value === 'IIA') {
          newData.plan_estudios = '2020';
        }
      }

      return newData;
    });
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <AuthInput
              icon={User}
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <AuthInput
              icon={User}
              placeholder="Apellido Paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
              required
            />
            <>
              <AuthInput
                icon={User}
                placeholder="Apellido Materno (Opcional)"
                name="apellido_materno"
                value={formData.apellido_materno}
                onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Este campo es opcional para personas extranjeras o que no cuenten con apellido materno
              </p>
            </>
            <AuthInput
              icon={Hash}
              placeholder="Boleta"
              name="boleta"
              value={formData.boleta}
              onChange={(e) => setFormData({ ...formData, boleta: e.target.value })}
              required
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
                Inlcluye al menos una Mayúscula, Minúscula, y un Número. Debes tener al menos 8 carácteres
            </p>
            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Confirmar contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full px-3 py-2 border rounded-lg"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona carrera</option>
                <option value="ISC">Sistemas Computacionales</option>
                <option value="LCD">Ciencia de Datos</option>
                <option value="IIA">Inteligencia Artificial</option>
              </select>

              <div className="mt-4">
                {formData.carrera === 'ISC' ? (
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    name="plan_estudios"
                    value={formData.plan_estudios}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un plan</option>
                    <option value="2009">2009</option>
                    <option value="2020">2020</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value="2020"
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                    <input
                      type="hidden"
                      name="plan_estudios"
                      value="2020"
                    />
                    {(formData.carrera === 'LCD' || formData.carrera === 'IIA') && (
                      <motion.p
                        className="mt-1 text-sm text-gray-500"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Para {formData.carrera === 'LCD' ? 'Licenciatura en Ciencia de Datos ' : 'Inteligencia Artificial '}
                        solo está disponible el plan 2020
                      </motion.p>
                    )}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <h3 className="font-medium">Áreas de conocimiento (mín. 3)</h3>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                onChange={(e) => {
                  if (e.target.value === 'other') {
                    setShowCustomAreaPopup(true);
                  } else {
                    const areaId = parseInt(e.target.value);
                    if (!formData.areas_ids.includes(areaId)) {
                      setFormData(prev => ({
                        ...prev,
                        areas_ids: [...prev.areas_ids, areaId]
                      }));
                    }
                  }
                  e.target.value = '';
                }}
              >
                <option value="">Seleccionar área</option>
                <option value="other">Otra área...</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>

              <div className="space-y-2">
                {formData.areas_ids.map(areaId => {
                  const area = areas.find(a => a.id === areaId);
                  return area ? (
                    <div key={area.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span>{area.nombre}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          areas_ids: prev.areas_ids.filter(id => id !== areaId)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
                {formData.areas_custom.map(area => (
                  <div key={area} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        areas_custom: prev.areas_custom.filter(a => a !== area)
                      }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AuthLayout>
      <BackButton />

      <AuthCard>
        <div className="p-8 space-y-6">
          <Logo />
          {registrationSuccess ? (
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-green-500 text-5xl mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            ✓
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">¡Registro Exitoso!</h2>
        <p className="text-gray-600">
          Hemos enviado un correo de verificación a tu dirección de email.
        </p>
        <p className="text-gray-600">
          Por favor, verifica tu correo para activar tu cuenta.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Serás redirigido a la página de inicio de sesión en 10 segundos...
        </p>
      </motion.div>
    ) : (
      <>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
            <p className="text-gray-600">Paso {currentStep} de 3</p>
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={`h-2 rounded-full ${step <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                style={{ width: '3rem' }}
                initial={{ width: 0 }}
                animate={{ width: '3rem' }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            {error && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-4">
              {currentStep > 1 && (
                <AuthButton
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Anterior
                </AuthButton>
              )}
              <AuthButton
                type="submit"
                isLoading={isLoading}
              >
                {currentStep === 3 ? 'Registrarse' : 'Siguiente'}
              </AuthButton>
            </div>
          </form>
          </>
    )}
        </div>
      </AuthCard>

      {/* Modal para área personalizada */}
      {showCustomAreaPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Agregar área personalizada</h3>
            <input
              type="text"
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Nombre del área"
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
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Agregar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Registro;