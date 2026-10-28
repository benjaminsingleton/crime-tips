const TOKEN_KEY = 'crime_tips_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/health'),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  createTip: (payload) => request('/tips', { method: 'POST', body: payload }),
  updateTip: (id, payload) => request(`/tips/${id}`, { method: 'PATCH', body: payload }),
  submitTip: (id, payload) =>
    request(`/tips/${id}/submit`, { method: 'POST', body: payload || {} }),
  listTips: (criteria, value) =>
    request(`/tips?criteria=${encodeURIComponent(criteria)}&value=${encodeURIComponent(value)}`),
  getTip: (id) => request(`/tips/${id}`),
  updateTipFlags: (id, flags) =>
    request(`/tips/${id}/flags`, { method: 'PATCH', body: flags }),
  uploadAttachment: (id, file, onProgress) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/tips/${id}/attachments`);
      const token = getToken();
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject(new Error(data.error || 'Upload failed'));
        } catch (err) {
          reject(err);
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      const form = new FormData();
      form.append('file', file);
      xhr.send(form);
    }),
  deleteAttachment: (tipId, attachmentId) =>
    request(`/tips/${tipId}/attachments/${attachmentId}`, { method: 'DELETE' }),
  listAttachments: (tipId) => request(`/tips/${tipId}/attachments`),
  addNote: (tipId, note) =>
    request(`/tips/${tipId}/notes`, { method: 'POST', body: { note } }),
  deleteNote: (tipId, noteId) =>
    request(`/tips/${tipId}/notes/${noteId}`, { method: 'DELETE' }),
  metrics: () => request('/metrics'),

  listUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', body }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PATCH', body }),
  changePassword: (id, password) =>
    request(`/users/${id}/password`, { method: 'POST', body: { password } }),
  userActivity: (id) => request(`/users/${id}/activity`),
};
