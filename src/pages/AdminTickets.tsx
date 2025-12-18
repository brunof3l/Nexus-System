import { useEffect, useState } from 'react';
import { ticketService } from '../services/ticketService';
import type { Ticket, TicketStatus } from '../types';
import { Search, Filter, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { AdminLayout } from '../components/AdminLayout';

export function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'Todos'>('Todos');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      await ticketService.deleteTicket(id);
      setTickets(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await ticketService.updateTicketStatus(id, newStatus);
  };

  const filteredTickets = tickets
    .filter(t => statusFilter === 'Todos' || t.status === statusFilter)
    .filter(t => 
      (t.requester_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.id?.toString() || '').includes(searchTerm)
    );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Chamados</h1>
            <p className="text-slate-400">Visualize e gerencie todos os chamados do sistema</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadTickets} variant="secondary" size="sm">
              Atualizar Lista
            </Button>
          </div>
        </div>

        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Buscar por nome, descrição ou ID..." 
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900"
              />
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-900"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Aberto">Aberto</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </Select>
            </div>
          </div>
        </Card>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900 text-slate-200 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">ID / Solicitante</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Prioridade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-slate-500">#{String(ticket.id || '').slice(0,6)}</span>
                          <span className="font-medium text-white">{ticket.requester_name || 'Sem Nome'}</span>
                          <span className="text-xs">{ticket.sector || 'Sem Setor'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={ticket.description}>
                        {ticket.description || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ticket.priority === 'Alta' ? 'danger' : ticket.priority === 'Média' ? 'warning' : 'info'}>
                          {ticket.priority || 'Normal'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                         <Select 
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                            className={
                                ticket.status === 'Aberto' ? 'h-8 text-xs w-32 border-slate-600' :
                                ticket.status === 'Em Andamento' ? 'h-8 text-xs w-32 border-sky-500/50 text-sky-400 bg-sky-500/10' :
                                'h-8 text-xs w-32 border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                            }
                        >
                            <option value="Aberto">Aberto</option>
                            <option value="Em Andamento">Em Andamento</option>
                            <option value="Concluído">Concluído</option>
                        </Select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}</span>
                          <span>{ticket.created_at ? new Date(ticket.created_at).toLocaleTimeString() : '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(ticket.id)}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
