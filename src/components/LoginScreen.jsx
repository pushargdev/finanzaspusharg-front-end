import React, { useState } from 'react';
import { Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function LoginScreen({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;
      if (isRegistering) {
        if (!name || !email || !password) throw new Error('Completa todos los campos');
        userData = await registerUser(name, email, password, signupCode);
      } else {
        if (!email || !password) throw new Error('Completa tu email y contraseña');
        userData = await loginUser(email, password);
      }
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message || 'Error al autenticarse');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const demoUser = await loginUser('admin@pusharg.com', 'admin123');
      onLoginSuccess(demoUser);
    } catch (err) {
      // Fallback demo user if backend is connecting
      onLoginSuccess({
        _id: 'demo-user-1',
        name: 'pushArg Studio Admin',
        email: 'admin@pusharg.com',
        role: 'Admin',
        defaultCurrency: 'ARS',
        dolarBlueRate: 1280,
        token: 'mock-jwt-token'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0E17] flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-purple selection:text-white">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-magenta/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md bg-[#121827]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#0F172A] rounded-2xl p-2.5 mx-auto border border-white/10 shadow-glow-purple flex items-center justify-center">
            <img src="/logo.png" alt="pushArg Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">pushArg Finanzas</h1>
          <p className="text-xs text-slate-400">Plataforma de Control Financiero & Cuentas</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#171F33] rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setError(''); }}
            className={`py-2.5 rounded-lg transition-all ${
              !isRegistering 
                ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setError(''); }}
            className={`py-2.5 rounded-lg transition-all ${
              isRegistering 
                ? 'bg-gradient-to-r from-brand-violet to-brand-magenta text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu Nombre o Agencia"
                  className="w-full pl-10 pr-4 py-3 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pusharg.com"
                className="w-full pl-10 pr-4 py-3 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Código de Invitación</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupCode}
                  onChange={(e) => setSignupCode(e.target.value)}
                  placeholder="Código provisto por el equipo"
                  className="w-full pl-10 pr-4 py-3 bg-[#171F33] border border-slate-800 rounded-xl text-white outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-magenta text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-purple hover:opacity-95 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span>Cargando...</span>
            ) : (
              <>
                <span>{isRegistering ? 'Crear Cuenta' : 'Entrar a la Plataforma'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login */}
        <div className="pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1E293B]/80 hover:bg-[#28354D] text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Acceso Demo 1-Clic (pushArg Admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
