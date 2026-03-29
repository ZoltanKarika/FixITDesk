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

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (err) {
    // Hálózati hiba (nincs net, szerver nem elérhető, stb.)
    throw new Error('Error! Check your internet connection!');
  }

  if (response.status === 401) {
    let refreshResponse;
    try {
      refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      throw new Error('Error! Check your internet connection!');
    }

    if (refreshResponse.ok) {
      try {
        response = await fetch(`${API_URL}${path}`, options);
      } catch (err) {
        throw new Error('Error! Check your internet connection!');
      }
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