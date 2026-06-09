import axios from 'axios';

const api = axios.create({ baseURL: '' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vistaarwater_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vistaarwater_token');
      localStorage.removeItem('vistaarwater_user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  sendOtp: (data) => api.post('/api/auth/send-otp', data),
  verifyOtp: (data) => api.post('/api/auth/verify-otp', data),
  getMe: () => api.get('/api/auth/me'),
};

export const designAPI = {
  generate: (data) => api.post('/api/designs/generate', data),
  generateAI: (data) => api.post('/api/designs/generate-ai', data),
  save: (data) => api.post('/api/designs/save', data),
  list: () => api.get('/api/designs'),
  get: (id) => api.get(`/api/designs/${id}`),
  delete: (id) => api.delete(`/api/designs/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  list: () => api.get('/api/orders'),
  get: (id) => api.get(`/api/orders/${id}`),
};

export const productAPI = {
  list: () => api.get('/api/products'),
  calculatePrice: (data) => api.post('/api/products/calculate-price', data),
};

export const inquiryAPI = {
  create: (data) => api.post('/api/inquiries', data),
};

export const adminAPI = {
  getOrders: (status) => api.get('/api/admin/orders', { params: { status } }),
  updateOrder: (id, data) => api.patch(`/api/admin/orders/${id}`, data),
  getDesigns: () => api.get('/api/admin/designs'),
  getInquiries: (status) => api.get('/api/admin/inquiries', { params: { status } }),
  createProduct: (data) => api.post('/api/admin/products', data),
  updateProduct: (id, data) => api.patch(`/api/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`),
  getUsers: () => api.get('/api/admin/users'),
  updateUserStatus: (id, isSuspended) => api.patch(`/api/admin/users/${id}/status`, { is_suspended: isSuspended }),
  getMetrics: () => api.get('/api/admin/metrics'),
};

export default api;
