'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const MetricasPage = () => {
  const [metrics, setMetrics] = useState({
    usersData: [],
    proposalsData: [],
    activityData: []
  });



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Métricas del Sistema</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Usuarios por Carrera */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Distribución por Carrera</h2>
          <BarChart width={500} height={300} data={metrics.usersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="alumnos" fill="#8884d8" name="Alumnos" />
            <Bar dataKey="profesores" fill="#82ca9d" name="Profesores" />
          </BarChart>
        </div>

        {/* Propuestas por Tipo */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Propuestas por Tipo</h2>
          <LineChart width={500} height={300} data={metrics.proposalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="TT1" stroke="#8884d8" />
            <Line type="monotone" dataKey="Remedial" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default MetricasPage;