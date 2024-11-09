import React from 'react';
import { Users, GraduationCap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHomeProps {
  onSelectTab: (tab: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onSelectTab }) => {
  const cards = [
    {
      title: "Gestión de Alumnos",
      description: "Administra los perfiles y datos de los alumnos registrados",
      icon: GraduationCap,
      color: "bg-blue-500",
      onClick: () => onSelectTab('alumnos')
    },
    {
      title: "Gestión de Profesores",
      description: "Gestiona la información de los profesores",
      icon: Users,
      color: "bg-green-500",
      onClick: () => onSelectTab('profesores')
    },
    {
      title: "Gestión de Propuestas",
      description: "Administra las propuestas de trabajos terminales",
      icon: FileText,
      color: "bg-purple-500",
      onClick: () => onSelectTab('propuestas')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    show: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Panel de Administración
        </motion.h1>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={card.onClick}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
            >
              <div className={`${card.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
              <div className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                Acceder 
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;