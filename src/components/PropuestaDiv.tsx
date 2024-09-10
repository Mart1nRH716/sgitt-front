import React from 'react'
import { FiClock } from "react-icons/fi";
import { FaComputer } from "react-icons/fa6";
import { BsClipboardData } from "react-icons/bs";
import { LuBrainCircuit } from "react-icons/lu";
import { time } from 'console';

const sistemasLogo = <FaComputer className='w-1/6 text-oscure' />
const datosLogo = <BsClipboardData className='w-1/6 text-oscure' />
const iaLogo = <LuBrainCircuit className='w-1/6 text-oscure' />

const Propuesta = [
  {
    id: 1,
    logo: sistemasLogo,
    nombre: 'Criptografía de Curvas Elipticas',
    time: 'Ahora',
    area: 'Criptografía',
    descripcion: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem amet similique corporis sint ipsa minus delectus quo magni debitis commodi eius facilis, asperiores earum, deleniti maiores unde molestias minima!',
    carrera: 'Sistemas Computacionales'
  },
  {
    id: 2,
    logo: datosLogo,
    nombre: 'Análisis de Datos con Python',
    time: 'Hace 2 días',
    area: 'Ciencia de Datos',
    descripcion: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem amet similique corporis sint ipsa minus delectus quo magni debitis commodi eius facilis, asperiores earum, deleniti maiores unde molestias minima!',
    carrera: 'Ciencia de Datos'
  },
  {
    id: 3,
    logo: iaLogo,
    nombre: 'Machine Learning en Python',
    time: 'Hace 5 días',
    area: 'Machine Learning',
    descripcion: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem amet similique corporis sint ipsa minus delectus quo magni debitis commodi eius facilis, asperiores earum, deleniti maiores unde molestias minima!',
    carrera: 'Inteligencia Artificial'
  },
  {
    id: 4,
    logo: sistemasLogo,
    nombre: 'Desarrollo de Software',
    time: 'Hace 1 semana',
    area: 'Desarrollo de Software',
    descripcion: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos rem amet similique corporis sint ipsa minus delectus quo magni debitis commodi eius facilis, asperiores earum, deleniti maiores unde molestias minima!',
    carrera: 'Sistemas Computacionales'
  }
];

const PropuestaDiv = () => {
  return (
    <div>
      <div className='propDiv flex gap-10 justify-center flex-wrap items-center py-7'>
        {Propuesta.map(({id, logo, nombre, time, area, descripcion, carrera}) => (
          <div key={id} className='group group/item propUnica w-60 p-5 bg-white rounded-xl hover:bg-secondary shadow-lg shadow-oscure-400/700 hover:shadow-lg '>
            <span className='flex justify-between items-center gap-4'>
              <h1 className='text-base font-semibold text-black group-hover:text-white'>{nombre}</h1>
              <span className='flex items-center text-gray-400 gap-1'>
                <FiClock /> {time}
              </span>
            </span>
            <h6 className='text-gray-500'>{area}</h6>
            <p className='text-sm text-gray-400 pt-5 border-t-2 mt-5 group-hover:text-white'>
              {descripcion}
            </p>
      
            <div className='carrera flex items-center gap-2'>
              {logo}
              <span className='text-sm py-4 block group-hover:text-white'>{carrera}</span>
            </div>
      
            <button className='border-2 rounded-xl block p-2 w-full text-sm font-semibold hover:bg-white group-hover/item:text-black group-hover:text-white'>
              Contactar
            </button>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default PropuestaDiv;