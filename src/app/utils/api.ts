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