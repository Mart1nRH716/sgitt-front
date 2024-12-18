// src/components/SideBarAdmin.tsx

import React from "react";
import { 
  Users, 
  GraduationCap, 
  FileText, 
  LayoutDashboard,
  Settings,
  LogOut,
  BookOpen,
  Tag
} from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SideBarAdminProps {
  isOpen: boolean;
  toggleSideBar: () => void;
}

const SideBarAdmin: React.FC<SideBarAdminProps> = ({ toggleSideBar, isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const menuList = [
    { 
      icon: <LayoutDashboard className="text-xl" />, 
      name: "Dashboard", 
      path: "/admin"
    },
    // { 
    //   icon: <GraduationCap className="text-xl" />, 
    //   name: "Alumnos",
    //   path: "/admin#alumnos"
    // },
    // { 
    //   icon: <Users className="text-xl" />, 
    //   name: "Profesores",
    //   path: "/admin#profesores"
    // },
    // { 
    //   icon: <FileText className="text-xl" />, 
    //   name: "Propuestas",
    //   path: "/admin#propuestas"
    // },
    { 
      icon: <Settings className="text-xl" />, 
      name: "Configuración",
      path: "/admin/config"
    },
  ];

  return (
    <div className={`bg-help3 fixed p-5 top-0 left-0 h-full flex flex-col justify-between ${isOpen ? "w-52" : "w-20"} duration-300`}>
      <div className={`${isOpen ? "" : "flex flex-col items-center justify-center"} duration-300`}>
        <div className="flex items-center justify-between mb-10">
          <h1 className={`text-2xl cursor-pointer text-oscure font-bold ${!isOpen && "hidden"}`}>
            <Link href="/home">SGI<span className='text-secondary'>TT</span></Link>
          </h1>
          <button onClick={toggleSideBar} className="text-2xl">
            {isOpen ? "×" : "☰"}
          </button>
        </div>

        <nav>
          <ul className="flex flex-col gap-4">
            {menuList.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 p-2 rounded-lg
                    hover:bg-secondary/20 transition-colors
                    ${pathname === item.path ? 'bg-secondary/20' : ''}
                    ${!isOpen && 'justify-center'}`}
                >
                  {item.icon}
                  <span className={`${!isOpen && "hidden"} duration-300`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className={`flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg
          ${!isOpen && 'justify-center'}`}
      >
        <LogOut className="text-xl" />
        <span className={`${!isOpen && "hidden"} duration-300`}>
          Cerrar Sesión
        </span>
      </button>
    </div>
  );
};

export default SideBarAdmin;