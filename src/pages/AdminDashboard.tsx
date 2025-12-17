import { useEffect, useState } from 'react';
import { ticketService } from '../services/ticketService';
import type { Ticket, TicketStatus, TicketPriority } from '../types';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Filter, ArrowUpDown, LayoutDashboard, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TicketCard } from '../components/TicketCard';
import clsx from 'clsx';

export function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'Todos'>('Todos');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('admin_auth')) {
      navigate('/admin/login');
      return;
    }
    loadTickets();
  }, [navigate]);

  const loadTickets = async () => {
    setLoading(true);
    const data = await ticketService.getTickets();
    setTickets(data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await ticketService.updateTicketStatus(id, newStatus);
  };

  const handlePriorityChange = async (id: string, newPriority: TicketPriority) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, priority: newPriority } : t));
    await ticketService.updateTicketPriority(id, newPriority);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      setTickets(prev => prev.filter(t => t.id !== id));
      await ticketService.deleteTicket(id);
    }
  };

  const filteredAndSortedTickets = tickets
    .filter(t => filterStatus === 'Todos' || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityWeight = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Aberto').length,
    urgent: tickets.filter(t => t.priority === 'Alta' && t.status !== 'Concluído').length
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <LayoutDashboard className="w-8 h-8 text-violet-400" />
            </div>
            Painel de Controle
          </h1>
          <p className="text-slate-400 mt-2 ml-1">Visão geral dos chamados e métricas de atendimento.</p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button
            onClick={loadTickets}
            className="flex-1 md:flex-none justify-center items-center px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all font-medium shadow-sm active:scale-95"
          >
            <RefreshCw className={clsx("w-4 h-4 mr-2", loading && "animate-spin")} />
            Atualizar
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 md:flex-none justify-center items-center px-4 py-2.5 bg-slate-900/50 text-slate-400 border border-slate-800 rounded-xl hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/50 transition-all font-medium active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total de Chamados</p>
          <p className="text-4xl font-bold text-white mt-3">{stats.total}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-emerald-400/80 uppercase tracking-wider">Pendentes (Abertos)</p>
          <p className="text-4xl font-bold text-emerald-400 mt-3">{stats.open}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-rose-400" />
          </div>
          <p className="text-sm font-medium text-rose-400/80 uppercase tracking-wider">Urgência Alta</p>
          <p className="text-4xl font-bold text-rose-400 mt-3">{stats.urgent}</p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-sm p-0 text-slate-200 font-semibold cursor-pointer outline-none"
            >
              <option value="Todos" className="bg-slate-900">Todos</option>
              <option value="Aberto" className="bg-slate-900">Abertos</option>
              <option value="Em Andamento" className="bg-slate-900">Em Andamento</option>
              <option value="Concluído" className="bg-slate-900">Concluídos</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-400">Ordem:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-sm p-0 text-slate-200 font-semibold cursor-pointer outline-none"
            >
              <option value="date" className="bg-slate-900">Mais Recentes</option>
              <option value="priority" className="bg-slate-900">Prioridade</option>
            </select>
          </div>
        </div>
        
        <span className="text-sm text-slate-500 font-medium">
          Mostrando <span className="text-slate-300">{filteredAndSortedTickets.length}</span> resultados
        </span>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTickets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-500">
            <div className="bg-slate-800/50 p-4 rounded-full mb-4">
              <Filter className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium text-slate-400">Nenhum chamado encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou aguarde novos chamados.</p>
          </div>
        ) : (
          filteredAndSortedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
