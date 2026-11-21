
import api from '../api/api.js';

export async function registerUser({ name, email, password }) {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
  });

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem('civicpulse_token', token);
  }

  return user;
}

export async function loginUser({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem('civicpulse_token', token);
  }

  return user;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.user;
}

export function logoutUser() {
  localStorage.removeItem('civicpulse_token');
  localStorage.removeItem('civicpulse_user');
}
