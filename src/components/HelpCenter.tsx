import React, { useState } from 'react';
import {
  Book,
  HelpCircle,
  FileQuestion,
  Shield,
  AlertCircle,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function HelpCenter() {
  const [selectedSection, setSelectedSection] = useState('guide');

  const sections = {
    guide: {
      title: 'Guía de Inicio',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Bienvenido a SGITT</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">1. Registro y Verificación</h4>
              <p>Si eres Alumno: Comienza creando tu cuenta y verificando tu correo institucional. Si eres profesor: Ingresa al sistema con las credenciales proporcionadas y crea una nueva contraseña </p>
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
            <p className="text-gray-600">No hay límite en el número de propuestas que puedes crear como profesor. Como alumno esta limitado a 3</p>
          </div>
        </div>
      )
    },
    support: {
      title: 'Soporte Técnico',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Contacto de Soporte</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <p>soporte@sgitt.ipn.mx</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <p>55-1234-5678</p>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="text-blue-600" />
                <p>Chat en vivo (L-V 9:00-18:00)</p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Horario de Atención</h4>
            <p>Lunes a Viernes: 9:00 - 18:00<br />Sábados: 9:00 - 13:00</p>
          </div>
        </div>
      )
    },
    rules: {
      title: 'Reglamento y Normativas',
      content: (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Normativas Generales</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Uso apropiado de la plataforma</li>
              <li>Respeto a la propiedad intelectual</li>
              <li>Privacidad y protección de datos</li>
              <li>Código de conducta</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Requisitos de Propuestas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Formato y estructura</li>
              <li>Contenido académico</li>
              <li>Plazos y fechas límite</li>
              <li>Proceso de aprobación</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Documentos Importantes</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Reglamento de Titulación</li>
              <li>Lineamientos de Trabajo Terminal</li>
              <li>Políticas de Uso</li>
            </ul>
          </div>
        </div>
      )
    },
    report: {
      title: 'Reportar Problema',
      content: (
        <div className="space-y-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Problema</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Error técnico</option>
                <option>Problema de acceso</option>
                <option>Contenido inapropiado</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea 
                className="w-full p-2 border rounded-lg h-32" 
                placeholder="Describe el problema en detalle..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo de Contacto</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-lg"
                placeholder="tu@email.com"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Enviar Reporte
            </button>
          </form>
          <div className="text-sm text-gray-500 text-center">
            Nos pondremos en contacto contigo lo antes posible
          </div>
        </div>
      )
    }
  };

  const navigation = [
    { id: 'guide', name: 'Guía de Inicio', icon: Book },
    { id: 'faq', name: 'Preguntas Frecuentes', icon: FileQuestion },
    //{ id: 'support', name: 'Soporte Técnico', icon: HelpCircle },
    //{ id: 'rules', name: 'Reglamento y Normativas', icon: Shield },
    { id: 'report', name: 'Reportar Problema', icon: AlertCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:grid md:grid-cols-5">
          {/* Sidebar de navegación */}
          <div className="md:col-span-1 bg-gray-50 p-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                  {selectedSection === item.id && (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="md:col-span-4 p-8">
            <h2 className="text-2xl font-bold mb-6">
              {sections[selectedSection as keyof typeof sections].title}
            </h2>
            {sections[selectedSection as keyof typeof sections].content}
          </div>
        </div>
      </div>
    </div>
  );
}