import React from 'react';
import { X, Calendar, User, CheckCircle2, Clock, Trash2, ArrowUpRight, ArrowDownLeft, FileText, Cpu, Layers, Users, DollarSign } from 'lucide-react';

export default function ProjectDetailModal({ project, isOpen, onClose, onDeleteProject, onRegisterPayment, transactions, currency, rate = 1280 }) {
  if (!isOpen || !project) return null;

  const projectTxs = transactions.filter(t => t.projectId === (project._id || project.id));

  const formatDualMoney = (valARS, valUSD) => {
    const strARS = `$${Math.round(valARS || 0).toLocaleString('es-AR')} ARS`;
    const strUSD = `$${Math.round(valUSD || 0).toLocaleString('en-US')} USD`;
    return (
      <div>
        <span className="font-extrabold text-white text-base block">{currency === 'USD' ? strUSD : strARS}</span>
        <span className="text-[11px] text-slate-400 font-medium block">{currency === 'USD' ? strARS : strUSD}</span>
      </div>
    );
  };

  const pendingARS = Math.max(0, project.budgetARS - project.paidARS);
  const pendingUSD = Math.max(0, project.budgetUSD - project.paidUSD);

  const rawRatio = currency === 'USD'
    ? (project.budgetUSD > 0 ? (project.paidUSD / project.budgetUSD) * 100 : 0)
    : (project.budgetARS > 0 ? (project.paidARS / project.budgetARS) * 100 : 0);

  const isFullyPaid = pendingUSD <= 0 || pendingARS <= 0 || rawRatio >= 99.5;
  const paidRatio = isFullyPaid ? 100 : Math.min(Math.round(rawRatio), 100);

  const projectExpensesARS = projectTxs
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, t) => acc + t.amountARS, 0);

  const projectExpensesUSD = projectTxs
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, t) => acc + t.amountUSD, 0);

  const netMarginARS = project.paidARS - projectExpensesARS;
  const netMarginUSD = project.paidUSD - projectExpensesUSD;

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"?`)) {
      onDeleteProject(project.id);
      onClose();
    }
  };

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
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${isFullyPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                {isFullyPaid ? 'Completado (100% Cobrado)' : project.status}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{project.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
              <span>
                {project.clients && project.clients.length > 0 ? (
                  <>{project.clients.length > 1 ? 'Clientes' : 'Cliente'}: <strong className="text-slate-200">{project.clients.map((c) => `${c.name}${c.lastName ? ` ${c.lastName}` : ''}`).join(', ')}</strong></>
                ) : (
                  <>Cliente: <strong className="text-slate-200">{project.client}{project.clientLastName ? ` ${project.clientLastName}` : ''}</strong></>
                )}
              </span>
              <span>•</span>
              <span>Entrega: <strong className="text-slate-200">{typeof project.deadline === 'string' ? project.deadline.slice(0, 10) : new Date(project.deadline).toISOString().slice(0, 10)}</strong></span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRegisterPayment && !isFullyPaid && (
              <button
                onClick={() => onRegisterPayment(project)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Registrar un pago"
              >
                <DollarSign className="w-4 h-4" />
                <span>Registrar Pago</span>
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Eliminar proyecto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 bg-[#171F33] p-3.5 rounded-xl border border-slate-800">
          {project.description}
        </p>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#171F33] border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Presupuesto Total</span>
            {formatDualMoney(project.budgetARS, project.budgetUSD)}
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-emerald-500/30">
            <span className="text-[11px] text-emerald-400 font-semibold block mb-1">Cobrado ({paidRatio}%)</span>
            {formatDualMoney(project.paidARS, project.paidUSD)}
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-amber-500/30">
            <span className="text-[11px] text-amber-400 font-semibold block mb-1">Pendiente de Cobro</span>
            {formatDualMoney(pendingARS, pendingUSD)}
          </div>

          <div className="p-4 rounded-xl bg-[#171F33] border border-brand-purple/30">
            <span className="text-[11px] text-brand-purple font-semibold block mb-1">Ganancia Neta Est.</span>
            {formatDualMoney(netMarginARS, netMarginUSD)}
          </div>
        </div>

        {/* Related Transactions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-purple" />
            <span>Pagos Registrados & Movimientos ({projectTxs.length})</span>
          </h3>
          {projectTxs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No hay pagos registrados para este proyecto.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {projectTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      tx.type === 'Ingreso' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {tx.type === 'Ingreso' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </span>
                    <div>
                      <p className="font-bold text-white text-xs">{tx.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {typeof tx.date === 'string' ? tx.date.slice(0, 10) : new Date(tx.date).toISOString().slice(0, 10)} 
                        {tx.exchangeRate ? ` • Dólar a esa fecha: $${tx.exchangeRate.toLocaleString('es-AR')} ARS` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold text-sm block ${tx.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'Ingreso' ? '+' : '-'}${Math.round(tx.amountARS || 0).toLocaleString('es-AR')} ARS
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      ${Math.round(tx.amountUSD || 0).toLocaleString('en-US')} USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
