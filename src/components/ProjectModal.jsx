import React, { useState } from 'react';
import { X, Layers, User, Calendar, DollarSign, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectModal({ isOpen, onClose, onAddProject, rate = 1280 }) {
  if (!isOpen) return null;

  const COMPONENT_PRESETS = ['Campus web', 'Desktop app', 'Landing', 'App móvil', 'API / Backend', 'Panel admin', 'E-commerce', 'Storage', 'Branding / UI'];

  const [name, setName] = useState('');
  const [clients, setClients] = useState([{ name: '', lastName: '' }]);
  const [budgetARS, setBudgetARS] = useState('');
  const [budgetUSD, setBudgetUSD] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [components, setComponents] = useState([]);
  const [componentInput, setComponentInput] = useState('');
  const [techTags, setTechTags] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [contributions, setContributions] = useState([{ member: '', role: '', description: '' }]);

  const toggleComponent = (value) => {
    setComponents((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  };
  const addCustomComponent = () => {
    const v = componentInput.trim();
    if (v && !components.includes(v)) setComponents((prev) => [...prev, v]);
    setComponentInput('');
  };
  const addTechTag = () => {
    const v = techInput.trim().replace(/,$/, '');
    if (v && !techTags.includes(v)) setTechTags((prev) => [...prev, v]);
    setTechInput('');
  };
  const removeTechTag = (value) => setTechTags((prev) => prev.filter((t) => t !== value));

  const updateContribution = (index, field, value) => {
    setContributions((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };
  const addContribution = () => setContributions((prev) => [...prev, { member: '', role: '', description: '' }]);
  const removeContribution = (index) => setContributions((prev) => prev.filter((_, i) => i !== index));

  const updateClient = (index, field, value) => {
    setClients((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };
  const addClient = () => setClients((prev) => [...prev, { name: '', lastName: '' }]);
  const removeClient = (index) => setClients((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientList = clients
      .map((c) => ({ name: c.name.trim(), lastName: c.lastName.trim() }))
      .filter((c) => c.name);

    if (!name || clientList.length === 0) return;

    const bARS = parseFloat(budgetARS) || (parseFloat(budgetUSD) * rate || 0);
    const bUSD = parseFloat(budgetUSD) || (parseFloat(budgetARS) / rate || 0);

    // Fold a half-typed tech/component still in the input into the arrays.
    const pendingTech = techInput.trim().replace(/,$/, '');
    const techArr = pendingTech && !techTags.includes(pendingTech) ? [...techTags, pendingTech] : techTags;
    const pendingComp = componentInput.trim();
    const platformArr = pendingComp && !components.includes(pendingComp) ? [...components, pendingComp] : components;

    const category = platformArr.length === 0 ? 'General' : platformArr.length === 1 ? platformArr[0] : 'Varios';

    const contribArr = contributions
      .map((c) => ({ member: c.member.trim(), role: c.role.trim(), description: c.description.trim() }))
      .filter((c) => c.member);

    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      client: clientList[0].name,
      clientLastName: clientList[0].lastName,
      clients: clientList,
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
      technologies: techArr,
      platforms: platformArr,
      contributions: contribArr,
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-semibold">Clientes</label>
              <button
                type="button"
                onClick={addClient}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-[11px] font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {clients.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateClient(i, 'name', e.target.value)}
                  placeholder="Nombre"
                  className="col-span-5 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
                />
                <input
                  type="text"
                  value={c.lastName}
                  onChange={(e) => updateClient(i, 'lastName', e.target.value)}
                  placeholder="Apellido"
                  className="col-span-6 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => removeClient(i)}
                  disabled={clients.length === 1}
                  className="col-span-1 flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Componentes del proyecto</label>
            <p className="text-[10px] text-slate-500 mb-2">Qué incluye el proyecto. Tocá los que apliquen (podés elegir varios).</p>
            <div className="flex flex-wrap gap-1.5">
              {COMPONENT_PRESETS.map((c) => {
                const active = components.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleComponent(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      active
                        ? 'bg-brand-magenta/20 text-brand-magenta border-brand-magenta/40'
                        : 'bg-[#171F33] text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {components.filter((c) => !COMPONENT_PRESETS.includes(c)).map((c) => (
              <span key={c} className="inline-flex items-center gap-1 mt-2 mr-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40">
                {c}
                <button type="button" onClick={() => toggleComponent(c)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={componentInput}
                onChange={(e) => setComponentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomComponent(); } }}
                placeholder="Otro componente..."
                className="flex-1 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
              />
              <button
                type="button"
                onClick={addCustomComponent}
                className="px-2.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
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

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tecnologías</label>
            <p className="text-[10px] text-slate-500 mb-2">Stack usado. Escribí y Enter (o coma) para agregar cada una.</p>
            {techTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {techTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
                    {t}
                    <button type="button" onClick={() => removeTechTag(t)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTechTag(); } }}
              placeholder="Ej: React, Node, Bunny Storage, MongoDB, Electron..."
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-semibold">Aportes del Equipo</label>
              <button
                type="button"
                onClick={addContribution}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-[11px] font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {contributions.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input
                  type="text"
                  value={c.member}
                  onChange={(e) => updateContribution(i, 'member', e.target.value)}
                  placeholder="Integrante"
                  className="col-span-3 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
                />
                <input
                  type="text"
                  value={c.role}
                  onChange={(e) => updateContribution(i, 'role', e.target.value)}
                  placeholder="Rol / tarea"
                  className="col-span-3 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
                />
                <input
                  type="text"
                  value={c.description}
                  onChange={(e) => updateContribution(i, 'description', e.target.value)}
                  placeholder="Qué hizo"
                  className="col-span-5 px-2.5 py-2 bg-[#171F33] border border-slate-800 rounded-lg text-white outline-none focus:border-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => removeContribution(i)}
                  disabled={contributions.length === 1}
                  className="col-span-1 flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
