
'use client';
import React from 'react';
import Layout from "@/components/Layout";
import CrearPropuesta from "@/components/CrearPropuesta";
import ProtectedRoute from '@/components/ProtectedRoute';

const App = () =>{
  return (
    <Layout>
      <CrearPropuesta />
    </Layout>
    
  );
}
// export default App;

export default () => (
  <ProtectedRoute>
    <App />
  </ProtectedRoute>
);
