import React from 'react'

const NabVar = () => {
  return (
    <div className='navBar flex justify-between items-center p-[3rem]'>
      <div className='logoDiv'>
        <h1 className='logo text-[25px] text-oscure font-bold'>SGI<span className='text-secondary '>TT</span></h1>
      </div>

      <div className='menu flex gap-7'>
        <li className='menuList text-[#023047] hover:text-primary'>Inicio</li>
        <li className='menuList text-[#023047] hover:text-primary'>Busqueda</li>
        <li className='menuList text-[#023047] hover:text-primary'>Agregar Propuesta</li>
        <li className='menuList text-[#023047] hover:text-primary'>Mi Perfil</li>
      </div>

    </div>
  )
}

export default NabVar