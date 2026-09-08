import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { MONTHLY_CASHFLOW } from '../mockData';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const CATEGORY_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

export default function ChartsSection({ transactions, projects, currency }) {
  // Compute expenses by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'Gasto')
    .reduce((acc, t) => {
      const cat = t.category || 'Otros';
      const val = currency === 'USD' ? t.amountUSD : t.amountARS;
      acc[cat] = (acc[cat] || 0) + val;
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map(cat => ({
    name: cat,
    value: expenseByCategory[cat]
  }));

  // Compute revenue by project
  const projectRevenueData = projects.map(p => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    Cobrado: currency === 'USD' ? p.paidUSD : p.paidARS,
    Pendiente: currency === 'USD' ? (p.budgetUSD - p.paidUSD) : (p.budgetARS - p.paidARS),
  }));

  const formatTooltipVal = (value) => {
    if (currency === 'USD') return `$${value.toLocaleString('en-US')} USD`;
    return `$${value.toLocaleString('es-AR')} ARS`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cashflow Monthly Area Chart (2 cols wide) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121827] border border-slate-800 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple" />
              <span>Flujo de Caja Mensual</span>
            </h3>
            <p className="text-xs text-slate-400">Evolución de ingresos cobrados vs. gastos operativos</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Ingresos
            </span>
            <span className="flex items-center gap-1.5 text-brand-magenta">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-magenta"></span> Gastos
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_CASHFLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [formatTooltipVal(val), '']}
              />
              <Area type="monotone" dataKey="Ingresos" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              <Area type="monotone" dataKey="Gastos" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorGastos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category Pie Chart (1 col wide) */}
      <div className="p-6 rounded-2xl bg-[#121827] border border-slate-800 flex flex-col justify-between shadow-md">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <PieIcon className="w-4 h-4 text-brand-magenta" />
            <span>Distribución de Gastos</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Desglose por categoría técnica y operativa</p>
        </div>

        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                formatter={(val) => [formatTooltipVal(val), 'monto']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-1.5 max-h-24 overflow-y-auto pr-1">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}></span>
                <span className="truncate max-w-[130px]">{item.name}</span>
              </span>
              <span className="font-semibold text-slate-200">{formatTooltipVal(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue per Project Bar Chart (Full Width across bottom of charts) */}
      <div className="lg:col-span-3 p-6 rounded-2xl bg-[#121827] border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-purple" />
              <span>Avance de Presupuesto por Proyecto</span>
            </h3>
            <p className="text-xs text-slate-400">Comparativa entre monto ya cobrado vs. saldo pendiente por proyecto</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [formatTooltipVal(val), '']}
              />
              <Bar dataKey="Cobrado" fill="#8B5CF6" radius={[6, 6, 0, 0]} stackId="a" />
              <Bar dataKey="Pendiente" fill="#334155" radius={[6, 6, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
