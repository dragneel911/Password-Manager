const BASE_URL = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  listEntries: () => request('/vault'),
  createEntry: (entry) => request('/vault', { method: 'POST', body: JSON.stringify(entry) }),
  updateEntry: (id, entry) => request(`/vault/${id}`, { method: 'PUT', body: JSON.stringify(entry) }),
  deleteEntry: (id) => request(`/vault/${id}`, { method: 'DELETE' }),
};
