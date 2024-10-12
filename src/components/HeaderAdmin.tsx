import React from "react";
import { RxDashboard } from "react-icons/rx";
import { FiBell } from "react-icons/fi";

const HeaderAdmin = () => {
  return (
    <div className="flex justify-between py-5 px-10  border-b border-secondary">
      <h1 className="font-bold text-primary text-xl uppercase flex items-center gap-3">
        Bienvenido a la vista de Adminitrador, {" "} 
        <span className="text-help2">SGITT</span>
      </h1>
      <div className="flex gap-2">
        <RxDashboard className="text-4xl border-2 border-help3 p-2 rounded-lg hover:bg-secondary duration-300 cursor-pointer" />
        <FiBell className="text-4xl border-2 border-help3 p-2 rounded-lg hover:bg-secondary duration-300 cursor-pointer" />
      </div>
    </div>
  );
}

export default HeaderAdmin;