import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  DollarSign, 
  Mail, 
  Phone, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Search
} from 'lucide-react';

export default function ClientsView({ projects, transactions, currency }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatMoney = (valARS, valUSD) => {
    if (currency === 'USD') return `$${valUSD.toLocaleString('en-US')} USD`;
    return `$${valARS.toLocaleString('es-AR')} ARS`;
  };

  // Group projects & transactions by client name
  const clientNames = Array.from(new Set([
    ...projects.map(p => p.client),
    ...transactions.map(t => t.client).filter(Boolean)
  ])).filter(c => c !== 'AWS Cloud' && c !== 'Vercel / GitHub' && c !== 'Freelance Dev Team' && c !== 'Diseñador Externo');

  const clientsData = clientNames.map(name => {
    const clientProjects = projects.filter(p => p.client === name);
    const clientTxs = transactions.filter(t => t.client === name);

    const totalBilledARS = clientProjects.reduce((acc, p) => acc + p.budgetARS, 0);
    const totalBilledUSD = clientProjects.reduce((acc, p) => acc + p.budgetUSD, 0);

    const totalPaidARS = clientProjects.reduce((acc, p) => acc + p.paidARS, 0);
    const totalPaidUSD = clientProjects.reduce((acc, p) => acc + p.paidUSD, 0);

    const pendingARS = totalBilledARS - totalPaidARS;
    const pendingUSD = totalBilledUSD - totalPaidUSD;

    return {
      name,
      contactPerson: 'Contacto Principal',
      email: `contacto@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: '+54 11 4982-1200',
      cuit: '30-71829102-8',
      projects: clientProjects,
      transactions: clientTxs,
      totalBilledARS,
      totalBilledUSD,
      totalPaidARS,
      totalPaidUSD,
      pendingARS,
      pendingUSD,
    };
  });

  const filteredClients = clientsData.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Search & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-purple" />
            <span>Directorio de Clientes & Cuentas</span>
          </h2>
          <p className="text-xs text-slate-400">Control de facturación, cobros e historial por empresa cliente</p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente o razón social..."
            className="w-full pl-10 pr-4 py-2 bg-[#121827] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const paidRatio = client.totalBilledARS > 0 ? Math.round((client.totalPaidARS / client.totalBilledARS) * 100) : 0;

          return (
            <div
              key={client.name}
              onClick={() => setSelectedClient(client)}
              className="p-6 rounded-2xl bg-[#121827] border border-slate-800 hover:border-brand-purple/50 transition-all duration-300 cursor-pointer group space-y-4 shadow-md relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet/20 to-brand-magenta/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-brand-purple transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{client.projects.length} Proyectos Vinculados</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Cobrado</span>
                  <span className="text-brand-purple">{paidRatio}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-violet to-brand-magenta rounded-full"
                    style={{ width: `${Math.min(paidRatio, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Financial Box */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Total Facturado</span>
                  <span className="font-extrabold text-white">
                    {formatMoney(client.totalBilledARS, client.totalBilledUSD)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Deuda Pendiente</span>
                  <span className={`font-extrabold ${client.pendingARS > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatMoney(client.pendingARS, client.pendingUSD)}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono text-slate-500">{client.cuit}</span>
                <span className="text-brand-purple font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-[#121827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
                  Ficha de Cliente Empresa
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedClient.name}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                  <span>CUIT: <strong className="text-slate-200">{selectedClient.cuit}</strong></span>
                  <span>•</span>
                  <span>Contacto: <strong className="text-slate-200">{selectedClient.contactPerson}</strong></span>
                </p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">Total Facturado</span>
                <span className="text-lg font-extrabold text-white">
                  {formatMoney(selectedClient.totalBilledARS, selectedClient.totalBilledUSD)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#171F33] border border-emerald-500/30 text-xs">
                <span className="text-emerald-400 block font-semibold mb-1">Total Cobrado</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {formatMoney(selectedClient.totalPaidARS, selectedClient.totalPaidUSD)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#171F33] border border-amber-500/30 text-xs">
                <span className="text-amber-400 block font-semibold mb-1">Saldo Pendiente</span>
                <span className="text-lg font-extrabold text-amber-400">
                  {formatMoney(selectedClient.pendingARS, selectedClient.pendingUSD)}
                </span>
              </div>
            </div>

            {/* Linked Projects */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-purple" />
                <span>Proyectos Contratados ({selectedClient.projects.length})</span>
              </h3>
              <div className="space-y-2">
                {selectedClient.projects.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#171F33] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category} • Estado: {p.status}</p>
                    </div>
                    <span className="font-extrabold text-white">
                      {formatMoney(p.budgetARS, p.budgetUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-magenta" />
                <span>Historial de Pagos & Movimientos ({selectedClient.transactions.length})</span>
              </h3>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {selectedClient.transactions.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-[#171F33] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{t.title}</p>
                      <p className="text-[10px] text-slate-400">{t.date} • {t.invoice}</p>
                    </div>
                    <span className="font-extrabold text-emerald-400">
                      +{formatMoney(t.amountARS, t.amountUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
