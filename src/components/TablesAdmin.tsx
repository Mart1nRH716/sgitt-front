import React, { useEffect, useState } from "react";  
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { FaSchool, FaChalkboardTeacher, FaBriefcase, FaBuilding, FaUserGraduate, FaBook, FaUniversity, FaUserTie } from "react-icons/fa"; 
import { motion } from "framer-motion";

const categories = [
  { name: "School", icon: <FaSchool className="text-3xl" /> },
  { name: "Teachers", icon: <FaChalkboardTeacher className="text-3xl" /> },
  { name: "Business", icon: <FaBriefcase className="text-3xl" /> },
  { name: "Corporate", icon: <FaBuilding className="text-3xl" /> },
  { name: "Students", icon: <FaUserGraduate className="text-3xl" /> },
  { name: "Library", icon: <FaBook className="text-3xl" /> },
  { name: "University", icon: <FaUniversity className="text-3xl" /> },
  { name: "Executives", icon: <FaUserTie className="text-3xl" /> },
];

const TablesAdmin = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Estado para el ancho de la pantalla

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth); // Actualizar el ancho de la pantalla

    window.addEventListener('resize', handleResize); // Escuchar cambios en el tamaño de la ventana
    return () => window.removeEventListener('resize', handleResize); // Limpiar el listener al desmontar
  }, []);

  // Duplicar las categorías para garantizar que siempre haya contenido visible
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="px-5 py-5 flex flex-col gap-3 overflow-hidden max-w-full">
      <div className="flex justify-between items-center">
        <h3 className="table-title">Tablas</h3>
        <PiDotsThreeOutlineLight className="cursor-pointer hover:text-secondary" />
      </div>

      <motion.div 
        className="flex gap-4 w-full flex-wrap" // Cambiado para permitir el ajuste
        animate={{ x: ["100%", `-${(screenWidth / 2)}px`] }} // Ajustado para el movimiento
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }} // Aumentar la duración para un movimiento más lento
      >
        {duplicatedCategories.map((category, index) => (
          <div key={index} className="flex flex-col items-center w-24 sm:w-32"> {/* Cambiado para ajustar el tamaño */}
            <div className="bg-help3 p-6 rounded-full hover:bg-secondary duration-300 cursor-pointer flex justify-center items-center w-24 h-24"> {/* Especifica el mismo ancho y alto */}
              <div className="text-white">
                {category.icon}
              </div>     
            </div>
            <span className="font-medium text-help2 mt-3">{category.name}</span>
          </div>
        ))}
      </motion.div>

      <style jsx>{`
        .overflow-hidden {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default TablesAdmin;
