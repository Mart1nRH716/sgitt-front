// Home.tsx
'use client'; // Esto marca el componente como Client Component
import React, { useState } from 'react';
import Buscador from "@/components/Buscador";
import Footer from "@/components/Footer";
import NabVar from "@/components/NabVar";
import PropuestaDiv from "@/components/PropuestaDiv";
import Layout from '@/components/Layout';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        
        <Buscador onSearch={setSearchTerm} /> {/* Pasa la función para actualizar el término de búsqueda */}
        <PropuestaDiv searchTerm={searchTerm} /> {/* Pasa el término de búsqueda */}
        
      </div>
    </Layout>

    
  );
}

export default Home;
