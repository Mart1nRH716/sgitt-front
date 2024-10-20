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

interface Propuesta {
  id: number;
  nombre: string;
  objetivo: string;
  palabras_clave: { id: number; palabra: string }[];
  fecha_creacion: string;
  fecha_actualizacion: string;
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
    console.log('Datos enviados al servidor:', userData);
    const response = await axios.post<ApiResponse>(`${API_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error de respuesta:', error.response?.data);
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
      if (error.response?.status === 403) {
        throw new Error(error.response.data.error || "No tienes permiso para acceder. Verifica tu correo o contacta al administrador.");
      } else if (error.response?.status === 401) {
        throw new Error("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
      }
      throw error.response?.data?.error || "Ocurrió un error al iniciar sesión.";
    }
    throw new Error("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
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

export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/verify-email/${token}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Si la respuesta contiene datos, devuélvelos
      if (error.response?.data) {
        return error.response.data;
      }
      throw error.response?.data || error.message;
    }
    throw error;
  }
};


export const obtenerPropuestasUsuario = async (): Promise<Propuesta[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró el token de acceso');
    }
    
    const response = await axios.get<Propuesta[]>(`${API_URL}/propuestas/mis_propuestas/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Propagamos el error de Axios para que sea manejado en el componente
      throw error;
    }
    throw new Error('Error inesperado al obtener las propuestas');
  }
};

export const buscarProfesores = async (query: string): Promise<any[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró el token de acceso');
    }
    
    const response = await axios.get(`${API_URL}/profesores/buscar/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: { q: query }
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




export const obtenerPropuestas = async (): Promise<Propuesta[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró el token de acceso');
    }
    
    const response = await axios.get<Propuesta[]>(`${API_URL}/propuestas/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Error inesperado al obtener las propuestas');
  }
};