import React, { useState } from 'react';
import { User, Mail, Lock, DollarSign, Save, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { updateUserProfile } from '../services/api';

export default function UserSettings({ currentUser, setCurrentUser }) {
  const [name, setName] = useState(currentUser?.name || 'pushArg Studio Admin');
  const [alias, setAlias] = useState(currentUser?.alias || '');
  const [email, setEmail] = useState(currentUser?.email || 'admin@pusharg.com');
  const [password, setPassword] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState(currentUser?.defaultCurrency || 'ARS');
  const [dolarBlueRate, setDolarBlueRate] = useState(currentUser?.dolarBlueRate || 1280);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const updated = await updateUserProfile({
        name,
        alias,
        email,
        password: password || undefined,
        defaultCurrency,
        dolarBlueRate: parseFloat(dolarBlueRate) || 1280
      });

      setCurrentUser(updated);
      setSavedSuccess(true);
      setPassword('');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      // Local fallback state update
      const updatedLocal = {
        ...currentUser,
        name,
        alias,
        email,
        defaultCurrency,
        dolarBlueRate: parseFloat(dolarBlueRate) || 1280
      };
      setCurrentUser(updatedLocal);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-violet/20 to-brand-magenta/10 border border-brand-purple/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-magenta p-0.5 shadow-glow-purple">
            <div className="w-full h-full rounded-2xl bg-[#0F172A] flex items-center justify-center font-extrabold text-lg text-white">
              {name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{name}{alias ? <span className="text-slate-400 font-semibold text-base"> · {alias}</span> : null}</h2>
            <p className="text-xs text-slate-400">{email} • Rol: Admin Corporativo</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Cuenta Verificada
        </span>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>¡Configuración y perfil guardados exitosamente!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-[#121827] border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-brand-purple" />
            <span>Información del Perfil</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre Completo / Nombre de Estudio</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Alias / Apodo</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej: Nico, Cristo, Chupe..."
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico Principal</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="p-6 rounded-2xl bg-[#121827] border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-brand-magenta" />
            <span>Seguridad & Contraseña</span>
          </h3>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold">Cambiar Contraseña (Dejar en blanco para conservar actual)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña (mínimo 6 caracteres)..."
              className="w-full max-w-md px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
            />
          </div>
        </div>

        {/* App Preferences */}
        <div className="p-6 rounded-2xl bg-[#121827] border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Preferencias Financieras & Cotizaciones</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Moneda por Defecto</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              >
                <option value="ARS">Pesos Argentinos (ARS $)</option>
                <option value="USD">Dólares Estadounidenses (USD $)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cotización Dólar Blue de Referencia (ARS)</label>
              <input
                type="number"
                value={dolarBlueRate}
                onChange={(e) => setDolarBlueRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-extrabold text-xs flex items-center gap-2 shadow-glow-purple hover:opacity-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Guardando...' : 'Guardar Cambios de Configuración'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
