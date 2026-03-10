import Cookies from "js-cookie";
import { API_URL } from "./config";

function getCSRFToken() {
  return Cookies.get('csrftoken') || '';
}

async function request(path, { method = 'GET', body = null, headers = {}, ...customOptions } = {}) {
  const options = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customOptions,
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    options.headers['X-CSRFToken'] = getCSRFToken();
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(`${API_URL}${path}`, options);

  if (response.status === 401) {
    const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      credentials: 'include',
    });
    console.log("RE-FRESH");

    if (refreshResponse.ok) {
      response = await fetch(`${API_URL}${path}`, options);
    } else {
      throw new Error('Session expired');
    }
  }

  return response;
}

const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};

export default api;