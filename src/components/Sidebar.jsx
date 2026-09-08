import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  TrendingUp, 
  PlusCircle, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenNewTx, onOpenNewProject }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Proyectos & Cuentas', icon: FolderKanban, badge: '5 Activos' },
    { id: 'transactions', label: 'Historial & Pagos', icon: Receipt, badge: null },
    { id: 'analytics', label: 'Análisis & Métricas', icon: TrendingUp, badge: 'PRO' },
  ];

  return (
    <aside className="w-72 bg-[#0E1322] border-r border-[#1E293B] flex flex-col justify-between shrink-0 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-6 flex items-center gap-3.5 border-b border-[#1E293B]/70">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-magenta rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-11 h-11 bg-[#0F172A] rounded-xl p-1.5 flex items-center justify-center border border-white/10 shadow-md">
              <img src="/logo.png" alt="pushArg Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">pushArg</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white uppercase tracking-wider">
                FIN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Gestión Financiera Multi-Proyecto</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={onOpenNewTx}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow-purple transition-all duration-200 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Movimiento</span>
          </button>
          
          <button
            onClick={onOpenNewProject}
            className="w-full py-2 px-4 rounded-xl bg-[#1E293B]/80 hover:bg-[#28354D] text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-brand-purple" />
            <span>Crear Proyecto</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Navegación Principal</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 text-white border border-brand-purple/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-magenta' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'PRO' 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-brand-purple/20 text-brand-purple'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info & User Widget */}
      <div className="p-4 space-y-3">
        {/* Mock Live Exchange Rate Widget */}
        <div className="p-3.5 rounded-xl bg-[#161E31] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Dólar Blue (Ref)</p>
              <p className="text-xs font-bold text-white">$1.280 ARS</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <ArrowUpRight className="w-3 h-3" /> +1.2%
          </span>
        </div>

        {/* User Card */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-violet to-brand-magenta p-0.5">
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center font-bold text-xs text-white">
                PA
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">pushArg Studio</p>
              <p className="text-[10px] text-slate-400 truncate">admin@pusharg.com</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
        </div>
      </div>
    </aside>
  );
}
