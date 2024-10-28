import React from "react";
import HeaderAdmin from "./HeaderAdmin";
import TablesAdmin from "./TablesAdmin";
import ChartAdmin from "./ChartAdmin";
import InfoAdmin from "./InfoAdmin";

const MainAdmin = () => {
  return (
    <div className="flex-1">
      <HeaderAdmin />
      <TablesAdmin />
    </div>
  );
}

export default MainAdmin;