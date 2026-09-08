import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  Percent, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function KpiCards({ transactions, projects, currency }) {
  // Calculations
  const formatMoney = (valARS, valUSD) => {
    if (currency === 'USD') {
      return `$${valUSD.toLocaleString('en-US')} USD`;
    }
    return `$${valARS.toLocaleString('es-AR')} ARS`;
  };

  const totalIncomeARS = transactions
    .filter(t => t.type === 'Ingreso' && t.status === 'Cobrado')
    .reduce((acc, curr) => acc + curr.amountARS, 0);

  const totalIncomeUSD = transactions
    .filter(t => t.type === 'Ingreso' && t.status === 'Cobrado')
    .reduce((acc, curr) => acc + curr.amountUSD, 0);

  const totalExpenseARS = transactions
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, curr) => acc + curr.amountARS, 0);

  const totalExpenseUSD = transactions
    .filter(t => t.type === 'Gasto' && t.status === 'Pagado')
    .reduce((acc, curr) => acc + curr.amountUSD, 0);

  const netBalanceARS = totalIncomeARS - totalExpenseARS;
  const netBalanceUSD = totalIncomeUSD - totalExpenseUSD;

  const pendingReceivablesARS = projects.reduce((acc, p) => acc + (p.budgetARS - p.paidARS), 0);
  const pendingReceivablesUSD = projects.reduce((acc, p) => acc + (p.budgetUSD - p.paidUSD), 0);

  const marginPercentage = totalIncomeARS > 0 ? Math.round((netBalanceARS / totalIncomeARS) * 100) : 0;

  const cards = [
    {
      title: 'Ingresos Totales (Cobrados)',
      value: formatMoney(totalIncomeARS, totalIncomeUSD),
      subtitle: '+18.4% vs mes anterior',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-emerald-500/0',
      borderColor: 'border-emerald-500/20',
      badgeText: '+18.4%',
      badgePositive: true,
    },
    {
      title: 'Gastos u Operación',
      value: formatMoney(totalExpenseARS, totalExpenseUSD),
      subtitle: 'Herramientas & Devs',
      icon: TrendingDown,
      iconColor: 'text-rose-400',
      bgGlow: 'from-rose-500/10 to-rose-500/0',
      borderColor: 'border-rose-500/20',
      badgeText: '-4.2%',
      badgePositive: true,
    },
    {
      title: 'Balance Neto (Profit)',
      value: formatMoney(netBalanceARS, netBalanceUSD),
      subtitle: `Margen Neto: ${marginPercentage}%`,
      icon: Wallet,
      iconColor: 'text-brand-purple',
      bgGlow: 'from-brand-purple/15 to-brand-magenta/5',
      borderColor: 'border-brand-purple/30',
      badgeText: 'Saludable',
      badgePositive: true,
    },
    {
      title: 'Pendiente de Cobro',
      value: formatMoney(pendingReceivablesARS, pendingReceivablesUSD),
      subtitle: 'Por hitos pendientes de entrega',
      icon: Clock,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-amber-500/0',
      borderColor: 'border-amber-500/20',
      badgeText: `${projects.filter(p => p.budgetARS > p.paidARS).length} proyectos`,
      badgePositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative p-5 rounded-2xl bg-[#121827] border ${card.borderColor} overflow-hidden group hover:border-slate-700 transition-all duration-300 shadow-md`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.bgGlow} rounded-bl-full pointer-events-none`}></div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{card.value}</h3>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{card.subtitle}</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                card.badgePositive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
