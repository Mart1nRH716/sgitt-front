// Home.tsx
'use client'; // Esto marca el componente como Client Component
import React, { useState } from 'react';
import Buscador from "@/components/Buscador";
import Footer from "@/components/Footer";
import NabVar from "@/components/NabVar";
import PropuestaDiv from "@/components/PropuestaDiv";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="w-[90%] m-auto">
      <NabVar />
      <Buscador onSearch={setSearchTerm} /> {/* Pasa la función para actualizar el término de búsqueda */}
      <PropuestaDiv searchTerm={searchTerm} /> {/* Pasa el término de búsqueda */}
      <Footer />
    </main>
  );
}

export default Home;
