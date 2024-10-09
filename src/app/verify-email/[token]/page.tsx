'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Footer from "@/components/Footer";
import { verifyEmail } from '../../utils/api';  // Asegúrate de que la ruta de importación sea correcta

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    const performVerification = async () => {
      try {
        const response = await verifyEmail(token);
        if (response.message) {
          // Si hay un mensaje en la respuesta, consideramos que es exitoso
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
      }
    };
  
    performVerification();
  }, [token]);

  return (
    <main className="w-[90%] m-auto">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          {verificationStatus === 'loading' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Verificando tu correo electrónico...</h2>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}
          {verificationStatus === 'success' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">¡Correo Verificado!</h2>
              <p className="mb-4">Tu cuenta ha sido activada exitosamente.</p>
              <a href="/login" className="text-blue-500 hover:underline">Iniciar sesión</a>
            </div>
          )}
          {verificationStatus === 'error' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-red-600">Error de Verificación</h2>
              <p className="mb-4">No pudimos verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.</p>
              <a href="/registro" className="text-blue-500 hover:underline">Volver al registro</a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default VerifyEmail;