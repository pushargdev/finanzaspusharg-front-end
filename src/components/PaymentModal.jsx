import React, { useState, useEffect, useRef } from 'react';
import { X, DollarSign, RefreshCw, Check, CalendarClock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchDolar, fetchDolarByDate } from '../services/api';

const today = () => new Date().toISOString().slice(0, 10);

export default function PaymentModal({ isOpen, onClose, project, onSubmit, fallbackRate = 1280 }) {
  const [rate, setRate] = useState(fallbackRate);
  const [rateInfo, setRateInfo] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [rateError, setRateError] = useState('');
  const [amountARS, setAmountARS] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const lastEdited = useRef(null); // 'ARS' | 'USD'

  const isHistoric = date < today();

  // Reset fields each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setAmountARS('');
      setAmountUSD('');
      setNote('');
      setDate(today());
      lastEdited.current = null;
    }
  }, [isOpen]);

  // Fetch the rate for the chosen date: live for today/future, historical for a past date.
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setLoadingRate(true);
    setRateError('');
    const request = date < today() ? fetchDolarByDate(date) : fetchDolar();
    request
      .then((d) => {
        if (!active || !d || !d.promedio) return;
        setRate(d.promedio);
        setRateInfo(d);
        // Re-derive the non-edited amount with the new rate.
        if (lastEdited.current === 'ARS' && amountARS) {
          setAmountUSD(String(Math.round((parseFloat(amountARS) / d.promedio) * 100) / 100));
        } else if (lastEdited.current === 'USD' && amountUSD) {
          setAmountARS(String(Math.round(parseFloat(amountUSD) * d.promedio)));
        }
      })
      .catch(() => { if (active) setRateError('Sin cotización para esa fecha'); })
      .finally(() => { if (active) setLoadingRate(false); });
    return () => { active = false; };
  }, [isOpen, date]);

  const onChangeARS = (v) => {
    lastEdited.current = 'ARS';
    setAmountARS(v);
    const n = parseFloat(v);
    setAmountUSD(!isNaN(n) && rate ? String(Math.round((n / rate) * 100) / 100) : '');
  };
  const onChangeUSD = (v) => {
    lastEdited.current = 'USD';
    setAmountUSD(v);
    const n = parseFloat(v);
    setAmountARS(!isNaN(n) ? String(Math.round(n * rate)) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ars = parseFloat(amountARS) || 0;
    const usd = parseFloat(amountUSD) || 0;
    if (ars <= 0 && usd <= 0) return;

    setSaving(true);
    try {
      await onSubmit({
        amountARS: Math.round(ars),
        amountUSD: Math.round(usd * 100) / 100,
        exchangeRate: rate,
        date,
        note: note.trim(),
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      onClose();
    } catch (err) {
      setSaving(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#121827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Registrar Pago</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{project.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rate banner: live today, historical for a past date */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#171F33] border border-slate-800 text-xs">
          <span className="flex items-center gap-2 text-slate-300">
            {isHistoric
              ? <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
              : <RefreshCw className={`w-3.5 h-3.5 text-brand-purple ${loadingRate ? 'animate-spin' : ''}`} />}
            {isHistoric ? `Dólar al ${rateInfo?.fecha || date}` : 'Dólar al momento'}
          </span>
          <span className="font-bold text-white">
            {loadingRate ? 'Cargando...' : rateError ? '—' : `$${rate.toLocaleString('es-AR')} ARS`}
          </span>
        </div>
        {rateError && <p className="text-[10px] text-rose-400 -mt-3">{rateError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monto ARS ($)</label>
              <input
                type="number"
                inputMode="decimal"
                value={amountARS}
                onChange={(e) => onChangeARS(e.target.value)}
                placeholder="Ej: 500000"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monto USD ($)</label>
              <input
                type="number"
                inputMode="decimal"
                value={amountUSD}
                onChange={(e) => onChangeUSD(e.target.value)}
                placeholder="Ej: 325"
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 -mt-2">
            Escribí uno y se completa el otro con el dólar {isHistoric ? 'de esa fecha' : 'de este momento'} (${rate.toLocaleString('es-AR')}).
          </p>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Fecha del pago</label>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value || today())}
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
            />
            {isHistoric && (
              <p className="text-[10px] text-amber-400/80 mt-1">
                Fecha pasada: se usa el dólar histórico de ese día{rateInfo?.fecha && rateInfo.fecha !== date ? ` (más cercano: ${rateInfo.fecha})` : ''}.
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nota (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Anticipo 50%, cuota 2..."
              className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500"
            />
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
              disabled={saving || loadingRate}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Registrar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
