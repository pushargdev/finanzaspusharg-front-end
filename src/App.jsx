import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import ProjectsGrid from './components/ProjectsGrid';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import ProjectModal from './components/ProjectModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import PaymentModal from './components/PaymentModal';
import LoginScreen from './components/LoginScreen';
import UserSettings from './components/UserSettings';
import ClientsView from './components/ClientsView';

import { INITIAL_PROJECTS, INITIAL_TRANSACTIONS } from './mockData';
import { 
  fetchProjects, 
  fetchTransactions, 
  createProject, 
  deleteProject,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction,
  fetchDolar,
  registerPayment
} from './services/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pusharg_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState(currentUser?.defaultCurrency || 'ARS');
  const [searchTerm, setSearchTerm] = useState('');

  // State arrays for live/mock data
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Live "dólar blue" rate (real-time from backend). Fallback while loading.
  const [dolar, setDolar] = useState({ promedio: 1280, venta: 1280, compra: 1280, fecha: null });
  const dolarRate = dolar?.promedio || 1280;

  // Modals state
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [payingProject, setPayingProject] = useState(null);

  // Fetch real-time data from Render API on mount if logged in
  useEffect(() => {
    if (currentUser) {
      loadLiveBackendData();
    }
  }, [currentUser]);

  // Fetch the live dólar blue rate on mount and refresh every 5 minutes.
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchDolar();
        if (active && data && data.promedio) setDolar(data);
      } catch (err) {
        console.error('Error al obtener cotización del dólar:', err);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const loadLiveBackendData = async () => {
    try {
      setIsLoading(true);
      const [projData, txData] = await Promise.all([
        fetchProjects(),
        fetchTransactions()
      ]);

      if (Array.isArray(projData)) {
        const normalizedProjs = projData.map(p => ({ ...p, id: p._id || p.id }));
        setProjects(normalizedProjs);
      }

      if (Array.isArray(txData)) {
        const normalizedTxs = txData.map(t => ({ ...t, id: t._id || t.id }));
        setTransactions(normalizedTxs);
      }

      setIsLiveConnected(true);
    } catch (err) {
      console.warn('⚠️ Render API connection notice:', err.message);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('pusharg_user', JSON.stringify(userData));
    if (userData.defaultCurrency) setCurrency(userData.defaultCurrency);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pusharg_user');
  };

  // Handlers for Project Operations
  const handleAddProject = async (newProj) => {
    setProjects([newProj, ...projects]);
    try {
      await createProject(newProj);
      loadLiveBackendData();
    } catch (err) {
      console.error('Error saving project to backend:', err);
    }
  };

  const handleDeleteProject = async (projId) => {
    setProjects(projects.filter(p => p.id !== projId));
    try {
      await deleteProject(projId);
      loadLiveBackendData();
    } catch (err) {
      console.error('Error deleting project from backend:', err);
    }
  };

  const handleRegisterPayment = async (paymentData) => {
    if (!payingProject) return;
    const projId = payingProject._id || payingProject.id;
    const result = await registerPayment(projId, paymentData);
    // Keep the open detail modal in sync with the new collected totals.
    if (result?.project) {
      const updated = { ...result.project, id: result.project._id || result.project.id };
      setSelectedProject((prev) => (prev && (prev._id || prev.id) === projId ? updated : prev));
    }
    await loadLiveBackendData();
  };

  // Handlers for Transaction Operations
  const handleAddTransaction = async (newTx) => {
    setTransactions([newTx, ...transactions]);
    try {
      await createTransaction(newTx);
      loadLiveBackendData();
    } catch (err) {
      console.error('Error saving transaction to backend:', err);
    }
  };

  const handleMarkPaid = async (txId) => {
    setTransactions(transactions.map(t => {
      if (t.id === txId) {
        const updatedStatus = t.type === 'Ingreso' ? 'Cobrado' : 'Pagado';
        return { ...t, status: updatedStatus };
      }
      return t;
    }));

    try {
      const tx = transactions.find(t => t.id === txId);
      const targetStatus = tx?.type === 'Ingreso' ? 'Cobrado' : 'Pagado';
      await updateTransactionStatus(txId, targetStatus);
      loadLiveBackendData();
    } catch (err) {
      console.error('Error updating transaction status:', err);
    }
  };

  const handleDeleteTransaction = async (txId) => {
    setTransactions(transactions.filter(t => t.id !== txId));
    try {
      await deleteTransaction(txId);
      loadLiveBackendData();
    } catch (err) {
      console.error('Error deleting transaction from backend:', err);
    }
  };

  // If not logged in, render LoginScreen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0E17] text-slate-100 font-sans selection:bg-brand-purple selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTx={() => setIsNewTxOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        dolar={dolar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          currency={currency}
          setCurrency={setCurrency}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />

        {/* Live API Status Banner */}
        <div className="px-8 pt-4">
          <div className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            isLiveConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
          }`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-brand-purple'}`}></span>
              <span>{isLiveConnected ? '⚡ Conectado en Vivo a Render API & MongoDB' : '💻 Modo Offline / Reconectando API Render...'}</span>
            </span>
            <button
              onClick={loadLiveBackendData}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all text-[11px]"
            >
              🔄 Sincronizar
            </button>
          </div>
        </div>

        {/* Dynamic View Body */}
        <main className="p-8 space-y-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <KpiCards transactions={transactions} projects={projects} currency={currency} />
              <ChartsSection transactions={transactions} projects={projects} currency={currency} />
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-white">Proyectos Activos Destacados</h3>
                <ProjectsGrid
                  projects={projects.slice(0, 3)}
                  currency={currency}
                  onSelectProject={setSelectedProject}
                  onOpenNewProject={() => setIsNewProjectOpen(true)}
                />
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              <ProjectsGrid
                projects={projects}
                currency={currency}
                onSelectProject={setSelectedProject}
                onOpenNewProject={() => setIsNewProjectOpen(true)}
              />
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <ClientsView
              projects={projects}
              transactions={transactions}
              currency={currency}
            />
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fade-in">
              <TransactionTable
                transactions={transactions}
                projects={projects}
                currency={currency}
                onMarkPaid={handleMarkPaid}
                onDeleteTx={handleDeleteTransaction}
                onOpenNewTx={() => setIsNewTxOpen(true)}
              />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in">
              <KpiCards transactions={transactions} projects={projects} currency={currency} />
              <ChartsSection transactions={transactions} projects={projects} currency={currency} />
            </div>
          )}

          {/* User Settings Tab */}
          {activeTab === 'settings' && (
            <UserSettings
              currentUser={currentUser}
              setCurrentUser={(updated) => {
                setCurrentUser(updated);
                localStorage.setItem('pusharg_user', JSON.stringify(updated));
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
        projects={projects}
        onAddTransaction={handleAddTransaction}
        rate={dolarRate}
      />

      <ProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onAddProject={handleAddProject}
        rate={dolarRate}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onDeleteProject={handleDeleteProject}
        onRegisterPayment={(proj) => setPayingProject(proj)}
        transactions={transactions}
        currency={currency}
        rate={dolarRate}
      />

      <PaymentModal
        isOpen={!!payingProject}
        project={payingProject}
        onClose={() => setPayingProject(null)}
        onSubmit={handleRegisterPayment}
        fallbackRate={dolarRate}
      />
    </div>
  );
}
