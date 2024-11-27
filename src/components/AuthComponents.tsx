import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const AuthCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const AuthInput = ({ 
  icon: Icon, 
  ...props 
}: { 
  icon: React.ElementType 
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
    />
  </div>
);

export const AuthButton = ({ children, isLoading, ...props }: { 
  children: React.ReactNode;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <motion.button
    {...(props as any)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
      hover:bg-primary/90 transform transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2
    `}
  >
    {isLoading ? (
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : children}
  </motion.button>
);

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary/10 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {children}
    </div>
  </div>
);

export const BackButton = () => (
  <Link 
    href="/" 
    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-300 mb-6"
  >
    <ArrowLeft className="w-5 h-5" />
    <span>Volver al inicio</span>
  </Link>
);

export const Logo = () => (
  <div className="flex items-center justify-center gap-2 mb-6">
    <BookOpen className="w-8 h-8 text-primary" />
    <h1 className="text-2xl font-bold">
      SGI<span className="text-primary">TT</span>
    </h1>
  </div>
);