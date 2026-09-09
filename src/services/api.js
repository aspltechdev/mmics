import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

/* =========================================================
   SESSION STORAGE KEYS
   =========================================================
   accountType tells us whether the logged in session belongs
   to an admin user or a portal member, so a 401 can send the
   person back to the right login screen.
   ========================================================= */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ACCOUNT_TYPE_KEY = 'accountType';

export const getAccountType = () => localStorage.getItem(ACCOUNT_TYPE_KEY) || 'admin';

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCOUNT_TYPE_KEY);
};

const saveSession = (token, user, accountType) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ACCOUNT_TYPE_KEY, accountType);
};

/* =========================================================
   INTERCEPTORS
   ========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
     * When a FormData body is sent, let the browser set the
     * Content-Type so it can add the multipart boundary.
     * Setting it by hand produces a boundary-less header and
     * the server rejects the upload - this is why some image
     * uploads failed while others worked.
     */
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const accountType = getAccountType();
      clearSession();

      const loginPath = accountType === 'member' ? '/member/login' : '/login';

      // Avoid a redirect loop when the 401 came from the
      // login request itself.
      if (!window.location.pathname.startsWith(loginPath)) {
        window.location.href = loginPath;
      }
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   FORM DATA HELPER
   =========================================================
   The old inline version used `data[key] && append(...)`,
   which silently dropped every falsy value. That meant
   isActive=false, sortOrder=0 and cleared text fields were
   never sent, so unchecking "Active" appeared to do nothing.
   ========================================================= */

export const toFormData = (data = {}) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof Date))) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// ============= ADMIN AUTH =============
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    if (response.data.success) {
      saveSession(response.data.data.token, response.data.data.user, 'admin');
    }

    return response.data;
  },
  logout: () => {
    clearSession();
    window.location.href = '/login';
  },
  getMe: () => api.get('/auth/me').then((res) => res.data.data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((res) => res.data),
  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

// ============= MEMBER PORTAL AUTH =============
export const memberAuthAPI = {
  login: async (email, password) => {
    const response = await api.post('/member/auth/login', { email, password });

    if (response.data.success) {
      saveSession(response.data.data.token, response.data.data.user, 'member');
    }

    return response.data;
  },
  logout: () => {
    clearSession();
    window.location.href = '/member/login';
  },
  getMe: () => api.get('/member/auth/me').then((res) => res.data.data),
  getDashboard: () => api.get('/member/auth/dashboard').then((res) => res.data.data),
  updateProfile: (data) =>
    api.put('/member/auth/profile', toFormData(data), multipart).then((res) => res.data.data),
  changePassword: (currentPassword, newPassword) =>
    api
      .post('/member/auth/change-password', { currentPassword, newPassword })
      .then((res) => res.data),
};

// ============= MEMBER MANAGEMENT (ADMIN) =============
export const memberAPI = {
  getAll: (params) => api.get('/members', { params }).then((res) => res.data),
  getById: (id) => api.get(`/members/${id}`).then((res) => res.data.data),
  create: (data) => api.post('/members', toFormData(data), multipart).then((res) => res.data),
  update: (id, data) =>
    api.put(`/members/${id}`, toFormData(data), multipart).then((res) => res.data.data),
  setStatus: (id, isActive) =>
    api.patch(`/members/${id}/status`, { isActive }).then((res) => res.data),
  delete: (id) => api.delete(`/members/${id}`).then((res) => res.data),
};

// ============= DASHBOARD =============
export const dashboardAPI = {
  /*
   * One request for every dashboard figure. Replaces the six
   * separate list calls the dashboard used to make.
   */
  getStats: (options = {}) =>
    api
      .get('/dashboard/stats', { params: options.refresh ? { refresh: 'true' } : {} })
      .then((res) => res.data.data),
};

// ============= PRODUCTS =============
export const productAPI = {
  getAll: (params) => api.get('/products', { params }).then((res) => res.data),

  /*
   * Fetch by database id. The admin edit form has an id, not
   * a slug, and used to call getBySlug(id) - which always
   * 404'd, so editing a product was impossible.
   */
  getById: (id) => api.get(`/products/id/${id}`).then((res) => res.data.data),

  getBySlug: (slug) => api.get(`/products/${slug}`).then((res) => res.data.data),
  create: (data) => api.post('/products', data).then((res) => res.data.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((res) => res.data.data),
  delete: (id) => api.delete(`/products/${id}`).then((res) => res.data),
  uploadImages: (productId, files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));

    return api
      .post(`/products/${productId}/images`, formData, multipart)
      .then((res) => res.data.data);
  },
  deleteImage: (imageId) => api.delete(`/products/images/${imageId}`).then((res) => res.data),
};

// ============= CATEGORIES =============
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }).then(res => res.data.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then(res => res.data.data),
  create: (data) =>
    api.post('/categories', toFormData(data), multipart).then((res) => res.data.data),
  update: (id, data) =>
    api.put(`/categories/${id}`, toFormData(data), multipart).then((res) => res.data.data),
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
  create: (data) =>
    api.post('/directors', toFormData(data), multipart).then((res) => res.data.data),
  update: (id, data) =>
    api.put(`/directors/${id}`, toFormData(data), multipart).then((res) => res.data.data),
  delete: (id) => api.delete(`/directors/${id}`).then(res => res.data),
};

// ============= GALLERY =============
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }).then(res => res.data.data),
  upload: (data) =>
    api.post('/gallery', toFormData(data), multipart).then((res) => res.data.data),
  delete: (id) => api.delete(`/gallery/${id}`).then(res => res.data),
};

// ============= NEWS =============
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }).then(res => res.data),
  getBySlug: (slug) => api.get(`/news/${slug}`).then(res => res.data.data),
  create: (data) =>
    api.post('/news', toFormData(data), multipart).then((res) => res.data.data),
  update: (id, data) =>
    api.put(`/news/${id}`, toFormData(data), multipart).then((res) => res.data.data),
  delete: (id) => api.delete(`/news/${id}`).then(res => res.data),
};

// ============= TESTIMONIALS =============
export const testimonialAPI = {
  getAll: (params) => api.get('/testimonials', { params }).then(res => res.data.data),
  create: (data) =>
    api.post('/testimonials', toFormData(data), multipart).then((res) => res.data.data),
  update: (id, data) =>
    api.put(`/testimonials/${id}`, toFormData(data), multipart).then((res) => res.data.data),
  delete: (id) => api.delete(`/testimonials/${id}`).then(res => res.data),
};

// ============= SETTINGS =============
export const settingsAPI = {
  get: () => api.get('/settings').then(res => res.data.data),
  update: (data) =>
    api.put('/settings', toFormData(data), multipart).then((res) => res.data.data),
};

// ============= HERO =============
export const heroAPI = {
  get: () => api.get('/hero').then(res => res.data.data),
  update: (data) =>
    api.put('/hero', toFormData(data), multipart).then((res) => res.data.data),
};

export default api;