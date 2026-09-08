import React from 'react';
import { X, Calendar, User, CheckCircle2, Clock, DollarSign, ArrowUpRight, ArrowDownLeft, FileText, Layers, Wallet } from 'lucide-react';

export default function ProjectDetailModal({ project, isOpen, onClose, transactions, currency }) {
  if (!isOpen || !project) return null;

  const projectTxs = transactions.filter(t => t.projectId === project.id);

  const formatMoney = (valARS, valUSD) => {
    if (currency === 'USD') return `$${valUSD.toLocaleString('en-US')} USD`;
    return `$${valARS.toLocaleString('es-AR')} ARS`;
  };

  const pendingARS = project.budgetARS - project.paidARS;
  const pendingUSD = project.budgetUSD - project.paidUSD;
  const paidRatio = project.budgetARS > 0 ? Math.round((project.paidARS / project.budgetARS) * 100) : 0;

  // Total project expense tied to this project
  const projectExpensesARS = projectTxs
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, t) => acc + t.amountARS, 0);

  const projectExpensesUSD = projectTxs
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, t) => acc + t.amountUSD, 0);

  const netMarginARS = project.paidARS - projectExpensesARS;
  const netMarginUSD = project.paidUSD - projectExpensesUSD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-[#121827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-violet/10 to-brand-magenta/10 rounded-bl-full pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                {project.status}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{project.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
              <span>Cliente: <strong className="text-slate-200">{project.client}</strong></span>
              <span>•</span>
              <span>Entrega: <strong className="text-slate-200">{project.deadline}</strong></span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 bg-[#171F33] p-3.5 rounded-xl border border-slate-800">
          {project.description}
        </p>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#171F33] border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Presupuesto Total</span>
            <span className="text-lg font-extrabold text-white">
              {formatMoney(project.budgetARS, project.budgetUSD)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-emerald-500/30">
            <span className="text-[11px] text-emerald-400 font-semibold block mb-1">Cobrado ({paidRatio}%)</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {formatMoney(project.paidARS, project.paidUSD)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-amber-500/30">
            <span className="text-[11px] text-amber-400 font-semibold block mb-1">Pendiente de Cobro</span>
            <span className="text-lg font-extrabold text-amber-400">
              {formatMoney(pendingARS, pendingUSD)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-brand-purple/30">
            <span className="text-[11px] text-brand-purple font-semibold block mb-1">Ganancia Neta Est.</span>
            <span className="text-lg font-extrabold text-brand-purple">
              {formatMoney(netMarginARS, netMarginUSD)}
            </span>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-magenta" />
            <span>Hitos de Pago & Entregables</span>
          </h3>
          <div className="space-y-2">
            {project.milestones && project.milestones.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${m.status === 'Cobrado' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className="font-semibold text-slate-200">{m.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-white">
                    {formatMoney(m.amountARS, Math.round(m.amountARS / 1280))}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    m.status === 'Cobrado' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Transactions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-purple" />
            <span>Movimientos Vinculados a este Proyecto</span>
          </h3>
          {projectTxs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No hay movimientos registrados para este proyecto.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {projectTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      tx.type === 'Ingreso' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {tx.type === 'Ingreso' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <p className="font-bold text-white">{tx.title}</p>
                      <p className="text-[10px] text-slate-400">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <span className={`font-extrabold ${tx.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'Ingreso' ? '+' : '-'}{formatMoney(tx.amountARS, tx.amountUSD)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
