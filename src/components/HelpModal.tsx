import React from 'react';
import { X, Book, FileQuestion, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = React.useState('guide');
  

  if (!isOpen) return null;

  const sections = {
    guide: {
      title: 'Guía de Inicio',
      content: (
        <div className="space-y-4">
          <p>Si eres Alumno: Comienza creando tu cuenta y verificando tu correo institucional.</p>
          <p>Si eres profesor: Ingresa al sistema con las credenciales proporcionadas y crea una nueva contraseña.</p>
          <p>Añade tus áreas de interés para que otros usuarios puedan encontrarte.</p>
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
            <h4 className="font-medium mb-2">¿Olvidé mi contraseña?</h4>
            <p className="text-gray-600">Usa la opción "Olvidé mi contraseña" en la página de inicio de sesión.</p>
          </div>
        </div>
      )
    },
    report: {
      title: 'Reportar Problema',
      content: (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">¿Problemas con el inicio de sesión?</h4>
            <p className="text-gray-600">Contacta al administrador del sistema: sgitt2002@gmail.com</p>
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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Centro de Ayuda</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 h-[calc(90vh-88px)]">
          <div className="col-span-1 bg-gray-50 p-4 border-r">
            <nav className="space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === key
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {key === 'guide' && <Book size={20} />}
                  {key === 'faq' && <FileQuestion size={20} />}
                  {key === 'report' && <AlertCircle size={20} />}
                  <span>{sections[key as keyof typeof sections].title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="col-span-3 p-6 overflow-y-auto">
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