// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export async function fetchKPIs() {
  const res = await fetch(`${API_BASE_URL}/analytics/kpis`);
  if (!res.ok) throw new Error('Error al obtener KPIs');
  return res.json();
}
