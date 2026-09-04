import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH =============
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  getMe: () => api.get('/auth/me').then(res => res.data.data),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// ============= PRODUCTS =============
export const productAPI = {
  getAll: (params) => api.get('/products', { params }).then(res => res.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then(res => res.data.data),
  create: (data) => api.post('/products', data).then(res => res.data.data),
  update: (id, data) => api.put(`/products/${id}`, data).then(res => res.data.data),
  delete: (id) => api.delete(`/products/${id}`).then(res => res.data),
  uploadImages: (productId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  deleteImage: (imageId) => api.delete(`/products/images/${imageId}`).then(res => res.data),
};

// ============= CATEGORIES =============
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }).then(res => res.data.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then(res => res.data.data),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  delete: (id) => api.delete(`/categories/${id}`).then(res => res.data),
};

// ============= ENQUIRIES =============
export const enquiryAPI = {
  submit: (data) => api.post('/enquiries', data).then(res => res.data),
  getAll: (params) => api.get('/enquiries', { params }).then(res => res.data),
  getById: (id) => api.get(`/enquiries/${id}`).then(res => res.data.data),
  update: (id, data) => api.put(`/enquiries/${id}`, data).then(res => res.data.data),
  delete: (id) => api.delete(`/enquiries/${id}`).then(res => res.data),
};

// ============= CONTACT =============
export const contactAPI = {
  submit: (data) => api.post('/contact', data).then(res => res.data),
  getAll: (params) => api.get('/contact', { params }).then(res => res.data),
  getById: (id) => api.get(`/contact/${id}`).then(res => res.data.data),
  update: (id, data) => api.put(`/contact/${id}`, data).then(res => res.data.data),
  delete: (id) => api.delete(`/contact/${id}`).then(res => res.data),
};

// ============= DIRECTORS =============
export const directorAPI = {
  getAll: (params) => api.get('/directors', { params }).then(res => res.data.data),
  getById: (id) => api.get(`/directors/${id}`).then(res => res.data.data),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.post('/directors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.put(`/directors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  delete: (id) => api.delete(`/directors/${id}`).then(res => res.data),
};

// ============= GALLERY =============
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }).then(res => res.data.data),
  upload: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  delete: (id) => api.delete(`/gallery/${id}`).then(res => res.data),
};

// ============= NEWS =============
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }).then(res => res.data),
  getBySlug: (slug) => api.get(`/news/${slug}`).then(res => res.data.data),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  delete: (id) => api.delete(`/news/${id}`).then(res => res.data),
};

// ============= TESTIMONIALS =============
export const testimonialAPI = {
  getAll: (params) => api.get('/testimonials', { params }).then(res => res.data.data),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.post('/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => data[key] && formData.append(key, data[key]));
    return api.put(`/testimonials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
  delete: (id) => api.delete(`/testimonials/${id}`).then(res => res.data),
};

// ============= SETTINGS =============
export const settingsAPI = {
  get: () => api.get('/settings').then(res => res.data.data),
  update: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  },
};

// ============= HERO =============
export const heroAPI = {
  get: () => api.get('/hero').then(res => res.data.data),
  update: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === 'backgroundImage' && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.put('/hero', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data.data);
  },
};

export default api;