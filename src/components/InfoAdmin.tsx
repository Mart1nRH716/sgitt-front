import React from "react";
import { FaArrowUp, FaChartBar, FaArrowDown, FaMoneyBillAlt } from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";

export const cardData = [
  {
    title: "Average Revenue",
    revenue: "$129K",
    growth: {
      percentage: "0.5%",
      icon: FaArrowUp,
      color: "text-green-700",
    },
    image: FaMoneyBillAlt,
    bgColor: "bg-green-50",
    linkText: "Click now",
    linkHref: "#",
  },
  {
    title: "Total Sales",
    revenue: "$500K",
    growth: {
      percentage: "1.2%",
      icon: FaArrowUp,
      color: "text-green-700",
    },
    image: FaChartBar,
    bgColor: "bg-yellow-50",
    linkText: "View details",
    linkHref: "#",
  },
  {
    title: "Monthly Profit",
    revenue: "$75K",
    growth: {
      percentage: "-0.8%",
      icon: FaArrowDown,
      color: "text-red-700",
    },
    image: MdMoneyOff,
    bgColor: "bg-blue-50",
    linkText: "See report",
    linkHref: "#",
  },
];

const InfoAdmin = () => {
  return (
    <div className="w-[350px]">
      <h3 className="table-title">Otros resultados</h3>
      <div className="flex flex-col gap-4">
        {cardData.map((item, index) => (
          <div key={index} className={`rounded-md overflow-hidden shadow-md ${item.bgColor}`}>
            <div className="flex items-center gap-4 p-4">
              <div className="bg-white p-3 rounded-full">
                {React.createElement(item.image, { className: "text-2xl" })}
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500">{item.revenue}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white">
              <div className="flex items-center gap-2">
                {React.createElement(item.growth.icon, { className: item.growth.color })}
                <p className={item.growth.color}>{item.growth.percentage}</p>
              </div>
              <a 
                href={item.linkHref} 
                className="text-secondary font-semibold hover:underline" 
                style={{ textDecoration: 'none' }}
              >
                {item.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoAdmin;
