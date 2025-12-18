import { useEffect, useState } from 'react';
import { ticketService } from '../services/ticketService';
import type { Ticket, TicketStatus } from '../types';
import { RefreshCw, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { AdminLayout } from '../components/AdminLayout';

export function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      console.log('Loading tickets...');
      const data = await ticketService.getTickets();
      console.log('Tickets loaded:', data);
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error('Invalid tickets data format:', data);
        setTickets([]);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    // Optimistic update
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await ticketService.updateTicketStatus(id, newStatus);
  };

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const filteredTickets = safeTickets
    .filter(t => filterStatus === 'Todos' || t.status === filterStatus)
    .filter(t => 
      (t.requester_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.id?.toString() || '').includes(searchTerm)
    )
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter(t => t.status === 'Aberto').length,
    inProgress: safeTickets.filter(t => t.status === 'Em Andamento').length,
    done: safeTickets.filter(t => t.status === 'Concluído').length
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        
        {/* Header & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-indigo-600 border-indigo-500 text-white">
                <p className="text-indigo-200 text-sm font-medium">Total de Chamados</p>
                <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
            </Card>
            <Card className="p-6">
                <p className="text-slate-400 text-sm font-medium">Abertos</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.open}</h3>
            </Card>
            <Card className="p-6">
                <p className="text-slate-400 text-sm font-medium">Em Andamento</p>
                <h3 className="text-3xl font-bold text-sky-400 mt-1">{stats.inProgress}</h3>
            </Card>
            <Card className="p-6">
                <p className="text-slate-400 text-sm font-medium">Concluídos</p>
                <h3 className="text-3xl font-bold text-emerald-400 mt-1">{stats.done}</h3>
            </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
                <div className="w-full md:w-64">
                    <Input 
                        placeholder="Buscar chamados..." 
                        icon={<Search className="w-4 h-4" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900"
                    />
                </div>
                <div className="w-40">
                    <Select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-slate-900"
                    >
                        <option value="Todos">Todos</option>
                        <option value="Aberto">Aberto</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluído">Concluído</option>
                    </Select>
                </div>
            </div>
            <Button onClick={loadTickets} variant="secondary" isLoading={loading}>
                <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
        </div>

        {/* Tickets List */}
        <div className="grid grid-cols-1 gap-4">
            {filteredTickets.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p>Nenhum chamado encontrado.</p>
                </div>
            ) : (
                filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-6 hover:border-slate-600 transition-colors group">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Badge variant="default">#{String(ticket.id || '').slice(0,6)}</Badge>
                                    <h3 className="text-lg font-semibold text-white">{ticket.requester_name || 'Sem Nome'}</h3>
                                    <span className="text-slate-500 text-sm">• {ticket.sector || 'Sem Setor'}</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                                    {ticket.description || 'Sem Descrição'}
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <Badge variant={ticket.priority === 'Alta' ? 'danger' : ticket.priority === 'Média' ? 'warning' : 'info'}>
                                        Prioridade {ticket.priority || 'Normal'}
                                    </Badge>
                                    <span className="text-xs text-slate-500">
                                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'} às {ticket.created_at ? new Date(ticket.created_at).toLocaleTimeString() : '-'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 min-w-[200px] justify-end">
                                <Select 
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                                    className={
                                        ticket.status === 'Aberto' ? 'text-slate-300 border-slate-600' :
                                        ticket.status === 'Em Andamento' ? 'text-sky-400 border-sky-500/50 bg-sky-500/10' :
                                        'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'
                                    }
                                >
                                    <option value="Aberto">Aberto</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                </Select>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
