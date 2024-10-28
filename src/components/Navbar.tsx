'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoMdMenu } from "react-icons/io";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { FiBell } from "react-icons/fi";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscador?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className='h-16 py-1 bg-white shadow-md sticky top-0 left-0 z-50 w-full'>
      <div className='flex items-center h-full gap-12 px-4'>
        <IoMdMenu className='text-2xl cursor-pointer hover:text-primary' onClick={toggleSidebar} />
        
        <Link href="/home" className='flex items-center gap-4 hover:opacity-80 transition-opacity'>
          <h1 className='logo text-[25px] cursor-pointer text-oscure font-bold'>
            SGI<span className='text-secondary'>TT</span>
          </h1>
        </Link>

        <form onSubmit={handleSearch} className='flex-1 max-w-xl hidden md:flex items-center relative'>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Buscar propuestas...'
            className='w-full py-2 px-4 pr-12 rounded-lg bg-gray-100 border border-secondary outline-none focus:ring-2 focus:ring-primary transition-all'
          />
          <button
            type="submit"
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors'
          >
            <BiSearchAlt className='text-xl' />
          </button>
        </form>

        <div className='flex items-center gap-4 ml-auto'>
          <Link href="/chat" className='relative text-secondary hover:text-primary transition-colors'>
            <AiOutlineMessage className='text-2xl' />
            <span className='absolute -top-1 -right-1 w-2 h-2 rounded-full bg-help2'></span>
          </Link>
          
          <Link href="/notificaciones" className='relative text-secondary hover:text-primary transition-colors'>
            <FiBell className='text-2xl' />
            <span className='absolute -top-1 -right-1 w-2 h-2 rounded-full bg-help2'></span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;