
import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    Accept: 'application/json',
  },
});

// Attach the saved JWT to requests that need authentication.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicpulse_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// If the server says the token is invalid or expired, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthCall && localStorage.getItem('civicpulse_token')) {
      localStorage.removeItem('civicpulse_token');
      localStorage.removeItem('civicpulse_user');
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);
export default api;
