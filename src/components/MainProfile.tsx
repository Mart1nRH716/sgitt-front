'use client';
import React, { useState, useEffect } from 'react';
import { LuPencilLine } from "react-icons/lu";
import { obtenerPerfilAlumno, obtenerPerfilProfesor } from '../app/utils/api';

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
  es_profesor: boolean;
}

const MainProfile = () => {
    const [userData, setUserData] = useState<AlumnoData | ProfesorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<'alumno' | 'profesor' | null>(null);

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
                                    <p><strong>Apellido:</strong> {profesorData.apellido}</p>
                                    <p><strong>Email:</strong> {profesorData.email}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-4">Materias Impartidas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profesorData.materias.map((materia) => (
                                        <span key={materia.id} className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                            {materia.nombre}
                                        </span>
                                    ))}
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
            <div className="relative mb-8">
                <img 
                    src="https://images.unsplash.com/photo-1606942040878-9a852c5045a3?q=80&w=1170&auto=format&fit=crop"
                    className="w-full h-72 object-cover rounded-lg"
                    alt="Cover"
                />
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-help3 hover:bg-help1 flex items-center justify-center transition-colors">
                    <LuPencilLine />
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                <img
                    src="https://plus.unsplash.com/premium_photo-1693723595870-2b8bad09b4c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGF6dWx8ZW58MHx8MHx8fDA%3D"
                    alt="Perfil"
                    className="w-28 h-28 object-cover rounded-full"
                />
                <div className="flex-grow">
                    <h2 className="text-2xl font-semibold mb-2">
                        {userData && (userType === 'alumno' 
                            ? `${(userData as AlumnoData).nombre} ${(userData as AlumnoData).apellido_paterno}`
                            : `${(userData as ProfesorData).nombre} ${(userData as ProfesorData).apellido}`
                        )}
                    </h2>
                    <span className="text-lg text-gray-500 capitalize">{userType}</span>
                </div>
                <button className="py-2 px-4 rounded bg-secondary hover:bg-primary transition-colors text-white flex items-center gap-2">
                    <LuPencilLine /> Editar Perfil
                </button>
            </div>

            {renderUserProfile()}
        </div>
    );
};

export default MainProfile;