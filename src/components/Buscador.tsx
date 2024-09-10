import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { MdOutlineCancel } from "react-icons/md";



const Buscador = () => {
  return (
    <div className='buscadorDiv grid gap-10 bg-secondary rounded-lg p-[3rem]'>
      <form action="">

        {/* Buscador */}
        <div className='primerDiv flex justify-between items-center rounded-xl gap-2 p-5 shadow-sm shadow-oscure bg-white '>
          <div className='flex gap-2 items-center w-full'>
            <BiSearchAlt className='text-xl icon' />
            <input type="text" className='bg-transparent text-oscure focus:outline-none w-full' placeholder='Busca una propuesta'/>
            <MdOutlineCancel className='text-xl icon text-red-500 hover:text-oscure mx-5'/>
          </div>

          <button className='bg-oscure h-full p-5 px-10 rounded-xl text-white cursor-pointer hover:bg-primary'>Buscar</button>


        </div>
      </form>

      <div className='secDiv flex items-center gap-10 justify-center'>

        <div className='busquedaUnica flex items-center gap-2 '>
          <label htmlFor="relevancia" className='text-oscure font-bold'>Ordenar: </label>
          <select name="" id="relevancia" className='bg-white rounded-md px-4 py-1'>
            <option value=""></option>
            <option value="relevancia">Relevancia</option>
            <option value="fecha">Fecha</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>
      


        <div className='busquedaUnica flex items-center gap-2 '>
          <label htmlFor="area" className='text-oscure font-bold'>Áreas: </label>
          <select name="" id="area" className='bg-white rounded-md px-4 py-1'>
            <option value=""></option>
            <option value="machine">Machine Learning</option>
            <option value="web">Desarrollo Web</option>
            <option value="mobile">Desarrollo Móvil</option>
            <option value="design">Diseño</option>
          </select>
        </div>


        <div className='busquedaUnica flex items-center gap-2 '>
          <label htmlFor="carrera" className='text-oscure font-bold'>Carrera: </label>
          <select name="" id="carrera" className='bg-white rounded-md px-4 py-1'>
            <option value=""></option>  
            <option value="datos">Ciencia de Datos</option>
            <option value="sistemas">Sistemas Computacionales</option>
            <option value="ia">Inteligencia Artificial</option>
          </select>
        </div>

        <span className='text-oscure cursor-pointer font-bold hover:text-help2'>Limpiar</span>

      </div>



    </div>
  )
}

export default Buscador