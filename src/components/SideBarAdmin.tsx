import React from "react";
import { 
  Users, 
  GraduationCap, 
  FileText, 
  LayoutDashboard,
  Settings,
  LogOut 
} from "lucide-react";
import { useRouter } from 'next/navigation';

interface SideBarAdminProps {
  isOpen: boolean;
  toggleSideBar: () => void;
  onSelectTab?: (tab: string) => void;
}

const SideBarAdmin: React.FC<SideBarAdminProps> = ({ toggleSideBar, isOpen, onSelectTab }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const menuList = [
    { 
      icon: <LayoutDashboard className="text-xl" />, 
      name: "Dashboard", 
      onClick: () => onSelectTab && onSelectTab('dashboard')
    },
    { 
      icon: <GraduationCap className="text-xl" />, 
      name: "Alumnos",
      onClick: () => onSelectTab && onSelectTab('alumnos')
    },
    { 
      icon: <Users className="text-xl" />, 
      name: "Profesores",
      onClick: () => onSelectTab && onSelectTab('profesores')
    },
    { 
      icon: <FileText className="text-xl" />, 
      name: "Propuestas",
      onClick: () => onSelectTab && onSelectTab('propuestas')
    },
    { 
      icon: <Settings className="text-xl" />, 
      name: "Configuración",
      onClick: () => router.push('/admin/config')
    },
  ];

  return (
    <div className={`bg-help3 fixed p-5 top-0 left-0 h-full flex flex-col justify-between ${isOpen ? "w-52" : "w-20"} duration-300`}>
      <div className={`${isOpen ? "" : "flex flex-col items-center justify-center"} duration-300`}>
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <h1 className={`text-2xl cursor-pointer text-oscure font-bold ${!isOpen && "hidden"}`}>
            <a href="/home">SGI<span className='text-secondary'>TT</span></a>
          </h1>
          <button onClick={toggleSideBar} className="text-2xl">
            {isOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Menú */}
        <nav>
          <ul className="flex flex-col gap-4">
            {menuList.map((item, index) => (
              <li 
                key={index} 
                onClick={item.onClick}
                className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg
                  hover:bg-secondary/20 transition-colors
                  ${!isOpen && 'justify-center'}`}
              >
                {item.icon}
                <span className={`${!isOpen && "hidden"} duration-300`}>
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Botón de cerrar sesión */}
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