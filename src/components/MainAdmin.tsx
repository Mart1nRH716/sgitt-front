import React, { useEffect, useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import TablesAdmin from "./TablesAdmin";
import DashboardHome from "./DashboardHome";

const MainAdmin = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setShowDashboard(false);
  };

  const handleReturnToDashboard = () => {
    setShowDashboard(true);
    setActiveTab(null);
  };

  return (
    <div className="flex-1">
      <HeaderAdmin onDashboardClick={handleReturnToDashboard} />
      {showDashboard ? (
        <DashboardHome onSelectTab={handleSelectTab} />
      ) : (
        <TablesAdmin activeTab={activeTab || 'alumnos'} />
      )}
    </div>
  );
};

export default MainAdmin;