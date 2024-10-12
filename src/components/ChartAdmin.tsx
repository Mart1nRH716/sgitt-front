import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface Series {
  name: string;
  data: number[];
}

interface Options {
  chart: {
    height: number;
    type: string;
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    curve: string;
  };
  xaxis: {
    type: string;
    categories: string[];
  };
  tooltip: {
    x: {
      format: string;
    };
  };
}

const ChartAdmin: React.FC = () => {
  const [series] = useState<Series[]>([
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]);

  const [options] = useState<Options>({
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <div className="flex-1">
      <h3 className="table-title">CRUD en cuestion</h3>
      <div className="flex-1 bg-help3 p-2 rounded-lg">
        <div>
          <ReactApexChart options={options} series={series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
}

export default ChartAdmin;
