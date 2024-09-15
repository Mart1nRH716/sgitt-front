import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface UserData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  boleta: string;
  email: string;
  carrera: string;
  plan_estudios: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface PropuestaData {
  nombre: string;
  objetivo: string;
  cantidad_alumnos: number;
  cantidad_profesores: number;
  requisitos: string[];
  palabras_clave: string[];
}


interface ApiResponse {
  // Define la estructura de tu respuesta API
  // Esto es solo un ejemplo, ajusta según la respuesta real de tu API
  token?: string;
  message?: string;
  // Agrega otros campos según sea necesario
}

export const register = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

export const login = async (credentials: Credentials): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/login/`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

interface ApiResponse {
  refresh: string;
  access: string;
  user_type: string;
}

export const crearPropuesta = async (propuestaData: PropuestaData): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);
    if (!token) {
      throw new Error('No se encontró el token de acceso');
    }
    
    const response = await axios.post<ApiResponse>(`${API_URL}/propuestas/`, propuestaData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', error.response?.data);
      throw error.response?.data || error.message;
    }
    console.error('Error no Axios:', error);
    throw error;
  }
};