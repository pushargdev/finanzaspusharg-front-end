import React, { useState } from 'react';
import { X, Layers, User, Calendar, DollarSign, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectModal({ isOpen, onClose, onAddProject }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Desarrollo Mobile');
  const [budgetARS, setBudgetARS] = useState('');
  const [budgetUSD, setBudgetUSD] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !client) return;

    const bARS = parseFloat(budgetARS) || (parseFloat(budgetUSD) * 1280 || 0);
    const bUSD = parseFloat(budgetUSD) || (parseFloat(budgetARS) / 1280 || 0);

    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      client,
      category,
      status: 'En Curso',
      budgetARS: bARS,
      budgetUSD: Math.round(bUSD),
      paidARS: 0,
      paidUSD: 0,
      startDate: new Date().toISOString().slice(0, 10),
      deadline,
      teamCostARS: Math.round(bARS * 0.3),
      teamCostUSD: Math.round(bUSD * 0.3),
      description: description || 'Proyecto registrado en pushArg Finanzas.',
      milestones: [
        { name: 'Anticipo 50%', amountARS: Math.round(bARS * 0.5), status: 'Pendiente', date: deadline }
      ]
    };

    onAddProject(newProj);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#121827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-purple" />
            <span>Crear Nuevo Proyecto</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nombre del Proyecto</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Dashboard Analytics BI, Landing Page V2..."
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre del Cliente</label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ej: Empresa S.A., Startup Inc..."
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Categoría Técnica</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              >
                <option value="Desarrollo Mobile">Desarrollo Mobile</option>
                <option value="Fullstack Web">Fullstack Web</option>
                <option value="Branding & UI/UX">Branding & UI/UX</option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Backend & API">Backend & API</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Presupuesto ARS ($)</label>
              <input
                type="number"
                value={budgetARS}
                onChange={(e) => setBudgetARS(e.target.value)}
                placeholder="Ej: 3500000"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Presupuesto USD ($)</label>
              <input
                type="number"
                value={budgetUSD}
                onChange={(e) => setBudgetUSD(e.target.value)}
                placeholder="Ej: 2800"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Fecha de Entrega Estimada</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Descripción Breve</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre entregables, requerimientos o contrato..."
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>

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
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
