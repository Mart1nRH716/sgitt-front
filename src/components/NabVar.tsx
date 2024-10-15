'use client';
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NabVar = () => {
  const pathname = usePathname()

  return (
    <div className='navBar flex justify-between items-center p-[3rem]'>
      <div className='logoDiv'>
        <Link href="/home">
          <h1 className='logo text-[25px] cursor-pointer text-oscure font-bold'>SGI<span className='text-secondary '>TT</span></h1>
        </Link>
      </div>

      <div className='menu flex gap-7'>
        <Link href="/home">
          <li className={`menuList text-[#023047] hover:text-primary cursor-pointer ${pathname === '/home' ? 'text-primary' : ''}`}>Inicio</li>
        </Link>
        <Link href="/home">
          <li className={`menuList text-[#023047] hover:text-primary cursor-pointer ${pathname === '/busqueda' ? 'text-primary' : ''}`}>Búsqueda</li>
        </Link>
        <Link href="/propuesta/crear">
          <li className={`menuList text-[#023047] hover:text-primary cursor-pointer ${pathname === '/propuesta/crear' ? 'text-primary' : ''}`}>Agregar Propuesta</li>
        </Link>
        <Link href="/perfil">
          <li className={`menuList text-[#023047] hover:text-primary cursor-pointer ${pathname === '/perfil' ? 'text-primary' : ''}`}>Mi Perfil</li>
        </Link>
      </div>
    </div>
  )
}

export default NabVar