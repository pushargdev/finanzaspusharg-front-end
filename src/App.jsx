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

import { INITIAL_PROJECTS, INITIAL_TRANSACTIONS } from './mockData';
import { 
  fetchProjects, 
  fetchTransactions, 
  createProject, 
  deleteProject,
  createTransaction, 
  updateTransactionStatus,
  deleteTransaction
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState('ARS');
  const [searchTerm, setSearchTerm] = useState('');

  // State arrays for live/mock data
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Modals state
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch real-time data from Render API on mount
  useEffect(() => {
    loadLiveBackendData();
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

  return (
    <div className="flex min-h-screen bg-[#0B0E17] text-slate-100 font-sans selection:bg-brand-purple selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTx={() => setIsNewTxOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
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
        </main>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
        projects={projects}
        onAddTransaction={handleAddTransaction}
      />

      <ProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onAddProject={handleAddProject}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onDeleteProject={handleDeleteProject}
        transactions={transactions}
        currency={currency}
      />
    </div>
  );
}
