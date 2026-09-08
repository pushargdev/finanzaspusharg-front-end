const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://finanzaspusharg-back-end.onrender.com/api';

// Projects API
export async function fetchProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (!res.ok) throw new Error('Error al obtener proyectos');
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Error al crear proyecto');
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Error al actualizar proyecto');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar proyecto');
  return res.json();
}

// Transactions API
export async function fetchTransactions(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/transactions?${query}`);
  if (!res.ok) throw new Error('Error al obtener transacciones');
  return res.json();
}

export async function createTransaction(txData) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Error al crear movimiento');
  return res.json();
}

export async function updateTransactionStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar movimiento');
  return res.json();
}

// Analytics API
export async function fetchKPIs() {
  const res = await fetch(`${API_BASE_URL}/analytics/kpis`);
  if (!res.ok) throw new Error('Error al obtener KPIs');
  return res.json();
}
