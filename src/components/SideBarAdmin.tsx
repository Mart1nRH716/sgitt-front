'use client';
import React from "react";
import { GiFireDash } from "react-icons/gi";
import { FaTachometerAlt, FaUser, FaCog, FaChartLine, FaDollarSign, FaUsers, FaFileAlt, FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

interface SideBarAdminProps {
  isOpen: boolean;
  toggleSideBar: () => void;
}

const menuList = [
  { icon: <FaTachometerAlt className="text-xl" />, name: "Dashboard" },
  { icon: <FaUser className="text-xl" />, name: "Profile" },
  { icon: <FaCog className="text-xl" />, name: "Settings" },
  { icon: <FaChartLine className="text-xl" />, name: "Analytics" },
  { icon: <FaDollarSign className="text-xl" />, name: "Sales Report" },
  { icon: <FaUsers className="text-xl" />, name: "Customers" },
  { icon: <FaFileAlt className="text-xl" />, name: "Invoices" },
];

const SideBarAdmin: React.FC<SideBarAdminProps> = ({ toggleSideBar, isOpen }) => {
  return (
    <div className={`bg-help3 fixed p-5 top-0 left-0 h-full flex flex-col justify-between ${isOpen ? "w-52" : "w-20"} duration-300`}>
      <div className={`${isOpen ? "" : "flex flex-col items-center justify-center"} duration-300`}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-4">
          <GiFireDash className="text-3xl cursor-pointer hover:text-gray-400" />
          <h1 className={`text-2xl cursor-pointer text-oscure font-bold ${isOpen ? "" : "hidden"} duration-300`}>
            SGI<span className='text-secondary'>TT</span>
          </h1>
        </div>

        {/* Menú */}
        <nav className="mt-20">
          <ul className="flex flex-col gap-6">
            {menuList.map((item, index) => (
              <li key={index} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-secondary">
                {item.icon}
                <span className={`${isOpen ? "" : "hidden"} duration-300`}>{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Toggle en la parte inferior */}
      <div className="mt-auto flex items-center justify-center p-3 cursor-pointer hover:bg-secondary text-2xl"
        onClick={toggleSideBar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </div>
  );
}

export default SideBarAdmin;
