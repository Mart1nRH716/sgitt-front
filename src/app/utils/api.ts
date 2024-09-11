import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface UserData {
  username: string;
  email: string;
  password: string;
  // Add any other fields that are part of the user registration data
}

interface Credentials {
  username: string;
  password: string;
}

interface ApiResponse {
  // Define the structure of your API response
  // This is just an example, adjust according to your actual API response
  token?: string;
  message?: string;
  // Add other fields as necessary
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