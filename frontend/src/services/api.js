import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (data) => api.post('/users/register', data),
};

// Account API
export const accountApi = {
  getAccounts: (userId) => api.get(`/accounts/user/${userId}`),
  getAccount: (accountNumber) => api.get(`/accounts/${accountNumber}`),
  createAccount: (data) => api.post('/accounts', data),
};

// Transaction API
export const transactionApi = {
  transfer: (data) => api.post('/transactions/transfer', data),
  getTransactions: (accountNumber) => api.get(`/transactions/account/${accountNumber}`),
};

export default api;
