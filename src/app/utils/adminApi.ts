// sgitt-front/src/app/utils/adminApi.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Profesores
export const fetchProfesores = async () => {
  try {
    const response = await axios.get(`${API_URL}/profesores/`, getAuthHeader());
    console.log('Response data:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('Error fetching profesores:', error);
    throw error;
  }
};

export const updateProfesor = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/profesores/${id}/`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating profesor:', error);
    throw error;
  }
};

export const deleteProfesor = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/profesores/${id}/delete/`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting profesor:', error);
    throw error;
  }
};

// Alumnos
export const fetchAlumnos = async () => {
  try {
    const response = await axios.get(`${API_URL}/alumnos/`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching alumnos:', error);
    throw error;
  }
};

export const updateAlumno = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/alumnos/${id}/`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating alumno:', error);
    throw error;
  }
};

export const deleteAlumno = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/alumnos/${id}/`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting alumno:', error);
    throw error;
  }
};

// Propuestas
export const fetchPropuestas = async () => {
  try {
    const response = await axios.get(`${API_URL}/propuestas/`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching propuestas:', error);
    throw error;
  }
};

export const updatePropuesta = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/propuestas/${id}/`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating propuesta:', error);
    throw error;
  }
};

export const deletePropuesta = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/propuestas/${id}/`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting propuesta:', error);
    throw error;
  }
};