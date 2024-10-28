import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchAdminStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats/`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const fetchAdminData = async (entity: string, searchTerm: string = '') => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/${entity}/?q=${searchTerm}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entity}:`, error);
    throw error;
  }
};

export const deleteAdminEntity = async (entity: string, id: number) => {
  try {
    await axios.delete(
      `${API_URL}/admin/${entity}/${id}/`,
      getAuthHeader()
    );
  } catch (error) {
    console.error(`Error deleting ${entity}:`, error);
    throw error;
  }
};

export const updateAdminEntity = async (entity: string, id: number, data: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/${entity}/${id}/`,
      data,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entity}:`, error);
    throw error;
  }
};

export const createAdminEntity = async (entity: string, data: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/${entity}/`,
      data,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating ${entity}:`, error);
    throw error;
  }
};