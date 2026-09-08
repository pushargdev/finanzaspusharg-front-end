const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://finanzaspusharg-back-end.onrender.com/api';

// Wake the backend (Render free tier sleeps after inactivity). Fire-and-forget.
export function wakeBackend() {
  return fetch(`${API_BASE_URL}/health`).catch(() => {});
}

// Build headers including the Bearer token from the logged-in user (localStorage).
function authHeaders(extra = {}) {
  const headers = { ...extra };
  try {
    const saved = localStorage.getItem('pusharg_user');
    if (saved) {
      const token = JSON.parse(saved)?.token;
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // ignore malformed storage
  }
  return headers;
}

// Auth API
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}

export async function registerUser(name, email, password, signupCode) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, signupCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrarse');
  return data;
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');
  return data;
}

// Projects API
export async function fetchProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener proyectos');
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Error al crear proyecto');
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Error al actualizar proyecto');
  return res.json();
}

export async function registerPayment(projectId, paymentData) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error('Error al registrar el pago');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar proyecto');
  return res.json();
}

// Transactions API
export async function fetchTransactions(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/transactions?${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener transacciones');
  return res.json();
}

export async function createTransaction(txData) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Error al crear movimiento');
  return res.json();
}

export async function updateTransactionStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar movimiento');
  return res.json();
}

// Dólar (público): cotización blue en tiempo real
export async function fetchDolar() {
  const res = await fetch(`${API_BASE_URL}/dolar`);
  if (!res.ok) throw new Error('Error al obtener cotización del dólar');
  return res.json();
}

// Dólar histórico para una fecha pasada (YYYY-MM-DD)
export async function fetchDolarByDate(date) {
  const res = await fetch(`${API_BASE_URL}/dolar/historico/${date}`);
  if (!res.ok) throw new Error('Sin cotización para esa fecha');
  return res.json();
}

// Analytics API
export async function fetchKPIs() {
  const res = await fetch(`${API_BASE_URL}/analytics/kpis`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener KPIs');
  return res.json();
}
