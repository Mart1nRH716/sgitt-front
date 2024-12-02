'use client';
import React, { useState, useEffect } from 'react';
import { LuPencilLine } from "react-icons/lu";
import { obtenerPerfilAlumno, obtenerPerfilProfesor } from '../app/utils/api';
import EditarPerfilModal from './EditarPerfilModal';
import alumnoIcono from '../utils/alumno_icono.png';
import profesorIcono from '../utils/profesor_icono.png';
import Image from 'next/image';
import CambiarContrasenaModal from './CambiarContrasenaModal';


// Mantener las mismas interfaces
interface BaseUserData {
  email: string;
  nombre: string;
  apellido_paterno?: string;
  apellido?: string;
}

interface AlumnoData extends BaseUserData {
  apellido_materno: string;
  boleta: string;
  carrera: string;
  plan_estudios: string;
  areas_alumno: Array<{id: number, nombre: string}>;
  email: string;
  nombre: string;
}

interface ProfesorData extends BaseUserData {
  materias: Array<{id: number, nombre: string}>;
  areas_profesor: Array<{id: number, nombre: string}>; 
  apellido_materno: string; 
  apellido_paterno: string;
  es_profesor: boolean;
  departamento: string;
  disponibilidad: number;
}

const MainProfile = () => {
    const [userData, setUserData] = useState<AlumnoData | ProfesorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<'alumno' | 'profesor' | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    const fetchUserData = async () => {
        try {
            const storedUserType = localStorage.getItem('user-Type');
            setUserType(storedUserType as 'alumno' | 'profesor');

            if (!storedUserType) {
                throw new Error('Tipo de usuario no encontrado');
            }

            const data = storedUserType === 'alumno' 
                ? await obtenerPerfilAlumno()
                : await obtenerPerfilProfesor();
            
            setUserData(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al cargar los datos del usuario');
            }
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserType = localStorage.getItem('user-Type');
                setUserType(storedUserType as 'alumno' | 'profesor');

                if (!storedUserType) {
                    throw new Error('Tipo de usuario no encontrado');
                }

                const data = storedUserType === 'alumno' 
                    ? await obtenerPerfilAlumno()
                    : await obtenerPerfilProfesor();
                
                setUserData(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Error al cargar los datos del usuario');
                }
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            </div>
        );
    }

    const renderUserProfile = () => {
        if (!userData || !userType) return null;

        if (userType === 'alumno') {
            const alumnoData = userData as AlumnoData;
            return (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-primary">Información Personal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-4">Datos Básicos</h3>
                                    <div className="space-y-2">
                                        <p><strong>Nombre:</strong> {alumnoData.nombre}</p>
                                        <p><strong>Apellido Paterno:</strong> {alumnoData.apellido_paterno}</p>
                                        <p><strong>Apellido Materno:</strong> {alumnoData.apellido_materno}</p>
                                        <p><strong>Email:</strong> {alumnoData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-4">Información Académica</h3>
                                    <div className="space-y-2">
                                        <p><strong>Boleta:</strong> {alumnoData.boleta}</p>
                                        <p><strong>Carrera:</strong> {alumnoData.carrera}</p>
                                        <p><strong>Plan de Estudios:</strong> {alumnoData.plan_estudios}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-semibold text-gray-700 mb-4">Áreas de Interés</h3>
                            <div className="flex flex-wrap gap-2">
                                {alumnoData.areas_alumno && alumnoData.areas_alumno.length > 0 ? (
                                    alumnoData.areas_alumno.map((area) => (
                                        <span key={area.id} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                                            {area.nombre}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No hay áreas de interés registradas</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // En el componente MainProfile, actualizar la sección del profesor:
        if (userType === 'profesor') {
            const profesorData = userData as ProfesorData;
            return (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-primary">Información Personal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Datos Básicos</h3>
                                <div className="space-y-2">
                                    <p><strong>Nombre:</strong> {profesorData.nombre}</p>
                                    <p><strong>Apellido Paterno:</strong> {profesorData.apellido_paterno}</p>
                                    <p><strong>Apellido Materno:</strong> {profesorData.apellido_materno}</p>
                                    <p><strong>Email:</strong> {profesorData.email}</p>
                                    <p><strong>Departamento:</strong> {profesorData.departamento}</p>
                                    <p><strong>Disponibilidad:</strong> {' '}
                                    <span className={profesorData.disponibilidad > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {profesorData.disponibilidad > 0 
                                        ? `${profesorData.disponibilidad} espacios disponibles` 
                                        : 'Sin disponibilidad'}
                                    </span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Materias Impartidas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profesorData.materias && profesorData.materias.length > 0 ? (
                                        profesorData.materias.map((materia) => (
                                            <span 
                                                key={materia.id} 
                                                className="px-4 py-2 bg-green-100 text-green-800 rounded-full transition-colors hover:bg-green-200"
                                            >
                                                {materia.nombre}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No hay materias registradas</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección de áreas de conocimiento */}
                        <div className="mt-8">
                            <h3 className="font-semibold text-gray-700 mb-4">Áreas de Conocimiento</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-wrap gap-2">
                                    {profesorData.areas_profesor && profesorData.areas_profesor.length > 0 ? (
                                        profesorData.areas_profesor.map((area) => (
                                            <span 
                                                key={area.id} 
                                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full transition-colors hover:bg-blue-200"
                                            >
                                                {area.nombre}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No hay áreas de conocimiento registradas</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                <Image
                    src={userType === 'alumno' ? alumnoIcono : profesorIcono}
                    alt="Perfil"
                    className="w-28 h-28 object-cover rounded-full"
                />
                <div className="flex-grow">
                    <h2 className="text-2xl font-semibold mb-2">
                        {userData && (userType === 'alumno' 
                            ? `${(userData as AlumnoData).nombre} ${(userData as AlumnoData).apellido_paterno} ${(userData as AlumnoData).apellido_materno}`
                            : `${(userData as ProfesorData).nombre} ${(userData as ProfesorData).apellido_paterno} ${(userData as ProfesorData).apellido_materno}`
                        )}
                    </h2>
                    <span className="text-lg text-gray-500 capitalize">{userType}</span>
                </div >
                <div className="flex gap-4">
                <button 
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="py-2 px-4 rounded bg-secondary hover:bg-primary transition-colors text-white flex items-center gap-2"
                    >
                        <LuPencilLine /> Cambiar Contraseña
                    </button>
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="py-2 px-4 rounded bg-secondary hover:bg-primary transition-colors text-white flex items-center gap-2"
                    >
                        <LuPencilLine /> Editar Perfil
                    </button>

                </div>
                
            </div>

            {renderUserProfile()}
            {/* Modal de edición */}
            {userData && userType && (
                <EditarPerfilModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={fetchUserData}
                    userType={userType}
                    currentData={userData}
                />
            )}
            {isChangePasswordModalOpen && (
                <CambiarContrasenaModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={() => setIsChangePasswordModalOpen(false)}
                />
            )}
        </div>

        
    );  
    
   
};

export default MainProfile;