import React, { useState } from 'react';
import { 
  FolderKanban, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight,
  Edit3,
  Wrench,
  FileText
} from 'lucide-react';

export default function ProjectsGrid({ projects, currency, onSelectProject, onOpenNewProject, onEditProject }) {
  const [filterCategory, setFilterCategory] = useState('Todos');

  const categories = ['Todos', 'Desarrollo Mobile', 'Fullstack Web', 'Branding & UI/UX', 'Desarrollo Web', 'Backend & API'];

  const filteredProjects = projects.filter(p => {
    if (filterCategory !== 'Todos' && p.category !== filterCategory) return false;
    return true;
  });

  const formatDualMoney = (valARS, valUSD) => {
    const strARS = `$${Math.round(valARS || 0).toLocaleString('es-AR')} ARS`;
    const strUSD = `$${Math.round(valUSD || 0).toLocaleString('en-US')} USD`;
    if (currency === 'USD') {
      return (
        <div>
          <span className="font-extrabold text-white text-sm">{strUSD}</span>
          <span className="text-[10px] text-slate-400 block font-normal">{strARS}</span>
        </div>
      );
    }
    return (
      <div>
        <span className="font-extrabold text-white text-sm">{strARS}</span>
        <span className="text-[10px] text-slate-400 block font-normal">{strUSD}</span>
      </div>
    );
  };

  const getStatusBadge = (status, isFullyPaid) => {
    if (isFullyPaid || status === 'Completado') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completado
        </span>
      );
    }
    if (status === 'Pendiente Pago') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" /> Pendiente Pago
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-purple/15 text-brand-purple border border-brand-purple/30">
        <Clock className="w-3.5 h-3.5" /> En Curso
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-sm'
                  : 'bg-[#121827] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenNewProject}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs font-bold flex items-center gap-2 shadow-glow-purple transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const projId = project.id || project._id;
          const pendingARS = Math.max(0, project.budgetARS - project.paidARS);
          const pendingUSD = Math.max(0, project.budgetUSD - project.paidUSD);

          const rawRatio = currency === 'USD'
            ? (project.budgetUSD > 0 ? (project.paidUSD / project.budgetUSD) * 100 : 0)
            : (project.budgetARS > 0 ? (project.paidARS / project.budgetARS) * 100 : 0);

          const isFullyPaid = pendingUSD <= 0 || pendingARS <= 0 || rawRatio >= 99.5;
          const paidRatio = isFullyPaid ? 100 : Math.min(Math.round(rawRatio), 100);

          const hasContract = project.hasContract || project.contractStatus === 'Con Contrato / Firmado';
          const contractStatus = project.contractStatus || (hasContract ? 'Con Contrato' : 'Sin Contrato');
          const hasMaintenance = project.hasMaintenance;
          const maintPct = project.maintenancePercentage || 10;
          const maintUSD = project.maintenanceAmountUSD || Math.round(project.budgetUSD * (maintPct / 100));

          return (
            <div
              key={projId}
              onClick={() => onSelectProject(project)}
              className="p-6 rounded-2xl bg-[#121827] border border-slate-800 hover:border-brand-purple/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-md"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-bl-full pointer-events-none group-hover:bg-brand-purple/10 transition-all"></div>

              <div>
                {/* Status & Category Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/50">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {onEditProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-colors"
                        title="Editar proyecto"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {getStatusBadge(project.status, isFullyPaid)}
                  </div>
                </div>

                {/* Title & Client */}
                <h3 className="text-lg font-extrabold text-white group-hover:text-brand-purple transition-colors mb-1">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                  <User className="w-3.5 h-3.5 text-brand-magenta" />
                  <span>Cliente: <strong className="text-slate-200">{project.client}</strong></span>
                </p>

                {/* Contract & Maintenance Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {hasContract ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                      📜 Contrato
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-500 border border-slate-800">
                      🚫 Sin Contrato
                    </span>
                  )}

                  {hasMaintenance ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-magenta/15 text-brand-magenta border border-brand-magenta/30 flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Mant. {maintPct}% (${maintUSD} USD/m)
                    </span>
                  ) : null}
                </div>

                {/* Progress Bar */}
                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Cobrado</span>
                    <span className={paidRatio === 100 ? 'text-emerald-400 font-extrabold' : 'text-brand-purple'}>
                      {paidRatio}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        paidRatio === 100 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-r from-brand-violet to-brand-magenta'
                      }`}
                      style={{ width: `${paidRatio}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dual Currency Financial Summary */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#171F33] border border-slate-800 text-xs mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Presupuesto Total</span>
                    {formatDualMoney(project.budgetARS, project.budgetUSD)}
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Pendiente</span>
                    {formatDualMoney(pendingARS, pendingUSD)}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Entrega: {typeof project.deadline === 'string' ? project.deadline.slice(0, 10) : new Date(project.deadline).toISOString().slice(0, 10)}</span>
                </span>
                <span className="text-brand-purple font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
