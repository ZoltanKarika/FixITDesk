// src/api.js
import Cookies from "js-cookie";
import { API_URL } from "./config";

function getCSRFToken() {
  return Cookies.get('csrftoken') || '';
}

async function request(path, { method = 'GET', body = null, headers = {}, ...customOptions } = {}) {
  const options = {
    method,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customOptions,
  };

  // Attach CSRF token for unsafe methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    options.headers['X-CSRFToken'] = getCSRFToken();
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);

  // Optionally handle unauthorized globally
  if (response.status === 401) {
    console.warn('Unauthorized! Maybe redirect to login?');
  }

  return response;
}

// Export simple helpers
const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
