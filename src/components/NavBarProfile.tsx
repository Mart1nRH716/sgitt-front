// NavBarProfile.tsx
'use client';
import React, { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { FiBell } from "react-icons/fi";

interface NavBarProfileProps {
  toggleSidebar: () => void;
}

const NavBarProfile: React.FC<NavBarProfileProps> = ({ toggleSidebar }) => {
  return (
    <div>
      <nav className='h-16 py-1 bg-white shadow-md sticky top-0 left-0 z-50 w-full'>
        <div className='flex items-center h-full gap-12'>
          <IoMdMenu className='mx-4 text-2xl cursor-pointer' onClick={toggleSidebar} />
          <a href="#" className='flex items-center gap-4'>
            <h1 className='logo text-[25px] text-oscure font-bold'>SGI<span className='text-secondary'>TT</span></h1>
          </a>
          <form action="" className='flex-1 max-w-lg hidden md:block'>
            <input type="search" name="buscador" id="buscador" placeholder='Realiza una busqueda' className='w-full py-2 px-4 rounded bg-gray-100 border border-secondary outline-none focus:ring-2 focus:ring-primary' />
          </form>
          <a href="#" className='ml-auto relative text-secondary hover:text-primary'>
            <AiOutlineMessage className='text-2xl' />
            <span className='absolute -top-1 w-2 h-2 rounded-full bg-help2 -left-1/8 -translate-x-1/2'></span>
          </a>
          <a href="#" className='relative text-secondary hover:text-primary ml-auto md:ml-0'>
            <FiBell className='mr-4 text-2xl' />
            <span className='absolute -top-1 w-2 h-2 rounded-full bg-help2 -left-1/8 -translate-x-1/2'></span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default NavBarProfile;