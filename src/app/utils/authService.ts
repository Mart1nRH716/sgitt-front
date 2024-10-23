import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TokenResponse {
  access: string;
  refresh: string;
}

class AuthService {
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<TokenResponse>(`${API_URL}/token/refresh/`, {
        refresh: refreshToken
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }

  static async getValidToken(): Promise<string | null> {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      token = await this.refreshToken();
    }
    return token;
  }
}

export default AuthService;