import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, Calendar, Tag, User, Layers } from 'lucide-react';
import { CATEGORIES } from '../mockData';
import confetti from 'canvas-confetti';

export default function TransactionModal({ isOpen, onClose, projects, onAddTransaction, rate = 1280 }) {
  if (!isOpen) return null;

  const [type, setType] = useState('Ingreso');
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState(CATEGORIES.Ingreso[0]);
  const [amountARS, setAmountARS] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [status, setStatus] = useState('Cobrado');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
    setStatus(newType === 'Ingreso' ? 'Cobrado' : 'Pagado');
  };

  const handleProjectSelect = (e) => {
    const id = e.target.value;
    setProjectId(id);
    const selected = projects.find(p => p.id === id);
    if (selected) {
      setClient(selected.client);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || (!amountARS && !amountUSD)) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const numARS = parseFloat(amountARS) || (parseFloat(amountUSD) * rate || 0);
    const numUSD = parseFloat(amountUSD) || (parseFloat(amountARS) / rate || 0);

    const newTx = {
      id: `tx-${Date.now()}`,
      type,
      title,
      projectId,
      projectName: selectedProj ? selectedProj.name : 'Proyecto General',
      client: client || (selectedProj ? selectedProj.client : 'Cliente Varios'),
      category,
      amountARS: numARS,
      amountUSD: Math.round(numUSD),
      currency: 'ARS',
      status,
      date,
      method: 'Transferencia Bancaria',
      invoice: `MOCK-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onAddTransaction(newTx);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#121827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-brand-magenta/5 rounded-bl-full pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-purple" />
            <span>Registrar Nuevo Movimiento</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Type Selector Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#171F33] rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('Ingreso')}
              className={`py-2 rounded-lg font-bold text-xs transition-all ${
                type === 'Ingreso'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              + Ingreso (Cobro)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('Gasto')}
              className={`py-2 rounded-lg font-bold text-xs transition-all ${
                type === 'Gasto'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              - Gasto / Egreso
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título o Concepto</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Anticipo 50% Sprint 1, Servidores Cloud, Dev Freelance..."
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>

          {/* Project & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Proyecto Asignado</label>
              <select
                value={projectId}
                onChange={handleProjectSelect}
                className="w-full px-3 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                <option value="varios">Infraestructura General / Varios</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              >
                {CATEGORIES[type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount ARS & USD */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monto en ARS ($)</label>
              <input
                type="number"
                value={amountARS}
                onChange={(e) => setAmountARS(e.target.value)}
                placeholder="Ej: 1500000"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monto en USD ($)</label>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                placeholder="Ej: 1200"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              >
                <option value={type === 'Ingreso' ? 'Cobrado' : 'Pagado'}>
                  {type === 'Ingreso' ? 'Cobrado' : 'Pagado'}
                </option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold shadow-glow-purple transition-all"
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
