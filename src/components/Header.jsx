import React from 'react';
import { Search, Bell, DollarSign, Filter, RefreshCw, Calendar } from 'lucide-react';

export default function Header({ currency, setCurrency, searchTerm, setSearchTerm, activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'projects':
        return 'Cuentas & Estado de Proyectos';
      case 'transactions':
        return 'Historial de Transacciones & Cobros';
      case 'analytics':
        return 'Reportes & Análisis Financiero';
      default:
        return 'Panel de Control General';
    }
  };

  return (
    <header className="h-20 bg-[#0E1322]/90 backdrop-blur-md border-b border-[#1E293B] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Page Context */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{getTabTitle()}</span>
          <span className="text-xs font-normal text-slate-400 bg-slate-800/80 border border-slate-700/50 px-2.5 py-0.5 rounded-full">
            pushArg Finanzas
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
          <Calendar className="w-3 h-3 text-brand-purple" />
          <span>Periodo Actual: Septiembre 2026</span>
        </p>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, proyecto o concepto..."
          className="w-full pl-10 pr-4 py-2 bg-[#161E31] border border-slate-800 focus:border-brand-purple rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Currency Switcher Toggle */}
        <div className="bg-[#161E31] p-1 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => setCurrency('ARS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              currency === 'ARS'
                ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇦🇷 ARS ($)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              currency === 'USD'
                ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 USD ($)
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-[#161E31] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-magenta animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}
