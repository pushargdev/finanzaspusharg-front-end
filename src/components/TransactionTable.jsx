import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransactionTable({ transactions, projects, currency, onMarkPaid, onOpenNewTx }) {
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'Todos' && t.type !== filterType) return false;
    if (filterStatus !== 'Todos' && t.status !== filterStatus) return false;
    if (selectedProject !== 'Todos' && t.projectId !== selectedProject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchClient = t.client?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchCat) return false;
    }
    return true;
  });

  const formatMoney = (valARS, valUSD) => {
    if (currency === 'USD') return `$${valUSD.toLocaleString('en-US')} USD`;
    return `$${valARS.toLocaleString('es-AR')} ARS`;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleMarkAsPaid = (tx) => {
    onMarkPaid(tx.id);
    triggerConfetti();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Fecha', 'Tipo', 'Título', 'Proyecto', 'Cliente', 'Categoría', 'Monto ARS', 'Monto USD', 'Estado'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      t.type,
      `"${t.title}"`,
      `"${t.projectName}"`,
      `"${t.client}"`,
      t.category,
      t.amountARS,
      t.amountUSD,
      t.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pushArg_finanzas_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#121827] border border-slate-800 space-y-5 shadow-md">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#171F33] p-1 rounded-xl border border-slate-800 text-xs">
            {['Todos', 'Ingreso', 'Gasto'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterType === type
                    ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#171F33] border border-slate-800 text-xs text-slate-200 font-semibold outline-none focus:border-brand-purple"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Cobrado">Cobrado / Pagado</option>
            <option value="Pendiente">Pendiente</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#171F33] border border-slate-800 text-xs text-slate-200 font-semibold outline-none focus:border-brand-purple max-w-[200px] truncate"
          >
            <option value="Todos">Todos los Proyectos</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 rounded-xl bg-[#171F33] hover:bg-[#202B45] text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-brand-purple" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Search Filter Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrar por nombre, cliente, comprobante o categoría..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-brand-purple"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#171F33] text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <th className="py-3.5 px-4">Movimiento</th>
              <th className="py-3.5 px-4">Proyecto / Cliente</th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-4 text-right">Monto</th>
              <th className="py-3.5 px-4 text-center">Estado</th>
              <th className="py-3.5 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                  No se encontraron transacciones con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'Ingreso';
                const isPaid = tx.status === 'Cobrado' || tx.status === 'Pagado';

                return (
                  <tr key={tx.id} className="hover:bg-[#171F33]/60 transition-colors">
                    {/* Movement Title & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-snug">{tx.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{tx.invoice || 'COMP-MOCK'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Project & Client */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{tx.projectName}</p>
                      <p className="text-[11px] text-slate-400">{tx.client}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-[11px] font-semibold text-slate-300">
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {tx.date}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-extrabold text-sm ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncome ? '+' : '-'}{formatMoney(tx.amountARS, tx.amountUSD)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      {!isPaid ? (
                        <button
                          onClick={() => handleMarkAsPaid(tx)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] border border-emerald-500/40 transition-all flex items-center gap-1 mx-auto"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Cobrado</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
