'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, UserPlus, LogIn, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import HelpModal from './HelpModal';

const Landing = () => {
  const router = useRouter();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary/10 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-12 h-12 text-primary" />
              <h1 className="text-4xl font-bold text-gray-800">
                SGI<span className="text-primary">TT</span>
              </h1>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHelpModalOpen(true)}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              title="Ayuda"
            >
              <HelpCircle className="w-8 h-8 text-primary" />
            </motion.button>
          </div>
          <p className="text-xl text-gray-600">
            Sistema de Gestión Integral Web para Trabajos Terminales
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </motion.button>

          <motion.button
            onClick={() => router.push('/registro')}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-5 h-5" />
            Registrarse
          </motion.button>
        </motion.div>

        <motion.div
          className="text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>© 2024 SGITT. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>

      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default Landing;