'use client';
import React, { useState } from 'react';
import { X, Book, FileQuestion, HelpCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitProblemReport } from '@/app/utils/api';
import Swal from 'sweetalert2';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('guide');
  const [report, setReport] = useState({
    type: 'Error Tecnico',
    description: '',
    email: ''
  });

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitProblemReport(report);
      Swal.fire({
        icon: 'success',
        title: '¡Reporte enviado!',
        text: 'Nos pondremos en contacto contigo pronto'
      });
      setReport({ type: 'Error Tecnico', description: '', email: '' });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el reporte. Por favor intenta más tarde.'
      });
    }
  };

  if (!isOpen) return null;

  const navigation = [
    { id: 'guide', name: 'Guía de Inicio', icon: Book },
    { id: 'faq', name: 'Preguntas Frecuentes', icon: FileQuestion },
    { id: 'report', name: 'Reportar Problema', icon: AlertCircle },
  ];

  const sections = {
    guide: {
      title: 'Guía de Inicio',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Bienvenido a SGITT</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">1. Registro y Verificación</h4>
              <p>Si eres Alumno: Comienza creando tu cuenta y verificando tu correo institucional. Si eres profesor: Ingresa al sistema con las credenciales proporcionadas y crea una nueva contraseña.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">2. Completar Perfil</h4>
              <p>Añade tus áreas de interés para que alumnos y profesores te puedan encontrar.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">3. Explorar Propuestas</h4>
              <p>Navega por las propuestas disponibles utilizando los filtros de búsqueda.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">4. Busca profesores o alumnos</h4>
              <p>Puedes utilizar el buscador para ingresar el objetivo o la idea de tu propuesta y encontrar alumnos o profesores relacionados de acuerdo a sus áreas de interés.</p>
            </div>
          </div>
        </div>
      )
    },
    faq: {
      title: 'Preguntas Frecuentes',
      content: (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">¿Cómo puedo cambiar mi contraseña?</h4>
            <p className="text-gray-600">Dirígete a la sección de perfil y selecciona la opción "Cambiar contraseña".</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">¿Puedo modificar una propuesta ya publicada?</h4>
            <p className="text-gray-600">Sí, los autores pueden editar sus propuestas en cualquier momento desde la sección "Mis Propuestas".</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">¿Cómo contacto a un profesor?</h4>
            <p className="text-gray-600">Puedes usar el sistema de mensajería interno o los datos de contacto proporcionados en la propuesta.</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">¿Cuántas propuestas puedo crear?</h4>
            <p className="text-gray-600">No hay límite en el número de propuestas que puedes crear como profesor. Como alumno está limitado a 3.</p>
          </div>
        </div>
      )
    },
    report: {
      title: 'Reportar Problema',
      content: (
        <div className="space-y-6">
          {/* <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Problema
              </label>
              <select
                value={report.type}
                onChange={(e) => setReport({ ...report, type: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              >
                <option value="Error Tecnico">Error técnico</option>
                <option value="Problema Acceso">Problema de acceso</option>
                <option value="Contenido Inapropiado">Contenido inapropiado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Problema
              </label>
              <textarea
                value={report.description}
                onChange={(e) => setReport({ ...report, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary h-32 resize-none"
                placeholder="Describe el problema en detalle..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo de Contacto
              </label>
              <input
                type="email"
                value={report.email}
                onChange={(e) => setReport({ ...report, email: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 
                       transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} />
              Enviar Reporte
            </button>
          </form> */}

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">
              Para problemas urgentes, contáctanos directamente en:
              <a href="mailto:sgitt2002@gmail.com" className="ml-1 underline">
                sgitt2002@gmail.com
              </a>
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Centro de Ayuda</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-5">
          <div className="col-span-1 bg-gray-50 p-4 border-r h-[calc(90vh-5rem)] overflow-y-auto">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                  {activeSection === item.id && (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="col-span-4 p-6 h-[calc(90vh-5rem)] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {sections[activeSection as keyof typeof sections].title}
            </h3>
            {sections[activeSection as keyof typeof sections].content}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpModal;