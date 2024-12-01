'use client';
import { useState } from 'react';
import { login } from '../app/utils/api';
import { Mail, Lock, LogIn, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import HelpModal from './HelpModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { 
  AuthLayout, 
  AuthCard, 
  AuthInput, 
  AuthButton, 
  BackButton,
  Logo 
} from './AuthComponents';
import { motion } from 'framer-motion';
import CambioContrasenaModal from './CambioContrasenaModal';
import AgregarAreasModal from './AgregarAreasModal';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);



  const [showAreasModal, setShowAreasModal] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('userEmail', response.user_email);
      localStorage.setItem('user-Type', response.user_type);
      
      if (response.user_type === 'profesor' && response.primer_inicio) {
        setShowPasswordModal(true);
      } else {
        window.location.href = '/home';
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <BackButton />
      
      <AuthCard>
        <motion.div 
          className="p-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
         <div className="flex justify-between items-center">
            <Logo />
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Ayuda"
            >
              <HelpCircle className="w-6 h-6 text-gray-500 hover:text-primary" />
            </button>
          </div>
          
          <motion.div 
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido de nuevo!</h2>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="Correo electrónico"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />

            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />

            {error && (
              <motion.div 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <AuthButton type="submit" isLoading={isLoading}>
              {!isLoading && <LogIn className="w-5 h-5" />}
              Iniciar Sesión
            </AuthButton>
          </form>
          {showPasswordModal && (
              <CambioContrasenaModal
                onPasswordChanged={() => {
                  setShowPasswordModal(false);
                  setShowAreasModal(true);
                }}
              />
            )}
            {showAreasModal && (
              <AgregarAreasModal
                onSkip={() => {
                  setShowAreasModal(false);
                  window.location.href = '/home';
                }}
                onComplete={() => {
                  setShowAreasModal(false);
                  window.location.href = '/home';
                }}
              />
            )}

          <div className="text-center space-y-2">
          <button 
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-primary hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
            
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/registro" 
                className="text-primary hover:underline font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthCard>
      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
      {showForgotPasswordModal && (
              <ForgotPasswordModal
                isOpen={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
              />
            )}
    </AuthLayout>
  );
};

export default Login;