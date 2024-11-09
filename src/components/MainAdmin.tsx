import React, { useEffect, useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import TablesAdmin from "./TablesAdmin";
import DashboardHome from "./DashboardHome";

const MainAdmin = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [activeTab2, setActiveTab2] = useState<string | null>(null);

  const handleSelectTab = (tab: string) => {
    setActiveTab2(tab);
    setShowDashboard(false);
  };

  const handleReturnToDashboard = () => {
    setShowDashboard(true);
    setActiveTab2(null);
  };

  return (
    <div className="flex-1">
      <HeaderAdmin onDashboardClick={handleReturnToDashboard} />
      {showDashboard ? (
        <DashboardHome onSelectTab={handleSelectTab} />
      ) : (
        <TablesAdmin activeTab2={activeTab2 || 'alumnos'} />
      )}
    </div>
  );
};

export default MainAdmin;