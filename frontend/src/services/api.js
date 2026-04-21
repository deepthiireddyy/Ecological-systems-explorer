import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // GEE can be slow
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export const imageryAPI = {
  getComposite: (payload) => api.post('/imagery/composite', payload)
};

export const indexAPI = {
  compute: (payload) => api.post('/index/compute', payload)
};

export const bluegreenAPI = {
  green: (payload) => api.post('/bluegreen/green', payload),
  blue: (payload) => api.post('/bluegreen/blue', payload),
  system: (payload) => api.post('/bluegreen/system', payload)
};

export const downloadAPI = {
  generateUrl: (payload) => api.post('/download/generate-url', payload)
};
