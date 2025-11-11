import axios from 'axios';

// Create React App uses process.env.REACT_APP_* for environment variables
// For Vite, use import.meta.env.VITE_*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  // Check for token in 'token' key first, then in 'auth' JSON object
  let token = localStorage.getItem('token');
  if (!token) {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Helper methods
export const get = async (url, config = {}) => {
  try {
    const response = await client.get(url, config);
    return response.data;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
};

export const post = async (url, data, config = {}) => {
  try {
    const response = await client.post(url, data, config);
    return response.data;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
};

export const patch = async (url, data, config = {}) => {
  try {
    const response = await client.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
};

export const put = async (url, data, config = {}) => {
  try {
    const response = await client.put(url, data, config);
    return response.data;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
};

export const del = async (url, config = {}) => {
  try {
    const response = await client.delete(url, config);
    return response.data;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
};

export default client;

