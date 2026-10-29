async function request(path, options = {}) {
  const { editToken, headers: optionHeaders, body, ...rest } = options;
  const headers = { ...(optionHeaders || {}) };
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  if (editToken) {
    headers['X-Tip-Edit-Token'] = editToken;
  }

  const res = await fetch(`/api${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    body:
      body && !(body instanceof FormData) && typeof body !== 'string'
        ? JSON.stringify(body)
        : body,
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
  getBranding: () => request('/branding'),
  getBrandingAdmin: () => request('/branding/admin'),
  updateBranding: (body) => request('/branding', { method: 'PUT', body }),
  resetBranding: () => request('/branding', { method: 'DELETE' }),
  uploadBrandingLogo: (file) => {
    const form = new FormData();
    form.append('logo', file);
    return request('/branding/logo', { method: 'POST', body: form });
  },
  deleteBrandingLogo: () => request('/branding/logo', { method: 'DELETE' }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  verifyMfa: (mfaToken, code) =>
    request('/auth/mfa/verify', { method: 'POST', body: { mfaToken, code } }),
  mfaStatus: () => request('/auth/mfa/status'),
  mfaSetup: () => request('/auth/mfa/setup', { method: 'POST' }),
  mfaConfirm: (code) =>
    request('/auth/mfa/confirm', { method: 'POST', body: { code } }),
  mfaDisable: (password, code) =>
    request('/auth/mfa/disable', { method: 'POST', body: { password, code } }),
  mfaAdminReset: (userId) =>
    request(`/auth/mfa/admin-reset/${userId}`, { method: 'POST' }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  createTip: (payload) => request('/tips', { method: 'POST', body: payload }),
  updateTip: (id, payload, editToken) =>
    request(`/tips/${id}`, { method: 'PATCH', body: payload, editToken }),
  submitTip: (id, payload, editToken) =>
    request(`/tips/${id}/submit`, { method: 'POST', body: payload || {}, editToken }),
  listTips: (criteria, value) =>
    request(`/tips?criteria=${encodeURIComponent(criteria)}&value=${encodeURIComponent(value)}`),
  getTip: (id) => request(`/tips/${id}`),
  updateTipFlags: (id, flags) =>
    request(`/tips/${id}/flags`, { method: 'PATCH', body: flags }),
  uploadAttachment: (id, file, onProgress, editToken) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/tips/${id}/attachments`);
      xhr.withCredentials = true;
      if (editToken) xhr.setRequestHeader('X-Tip-Edit-Token', editToken);
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
  deleteAttachment: (tipId, attachmentId, editToken) =>
    request(`/tips/${tipId}/attachments/${attachmentId}`, {
      method: 'DELETE',
      editToken,
    }),
  listAttachments: (tipId, editToken) =>
    request(`/tips/${tipId}/attachments`, { editToken }),
  downloadAttachment: async (tipId, attachmentId) => {
    const res = await fetch(`/api/tips/${tipId}/attachments/${attachmentId}/download`, {
      credentials: 'include',
    });
    if (!res.ok) {
      let message = 'Download failed';
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }
    return res.blob();
  },
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
