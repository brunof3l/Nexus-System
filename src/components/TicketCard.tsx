import type { Ticket, TicketStatus, TicketPriority } from '../types';
import { Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onPriorityChange: (id: string, priority: TicketPriority) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({ ticket, onStatusChange, onPriorityChange, onDelete }: TicketCardProps) {
  const statusColors = {
    'Aberto': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Em Andamento': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Concluído': 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const priorityColors = {
    'Baixa': 'bg-sky-500/10 text-sky-400',
    'Média': 'bg-orange-500/10 text-orange-400',
    'Alta': 'bg-rose-500/10 text-rose-400',
  };

  const statusIcons = {
    'Aberto': <AlertCircle className="w-3.5 h-3.5 mr-1.5" />,
    'Em Andamento': <Clock className="w-3.5 h-3.5 mr-1.5" />,
    'Concluído': <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center shadow-sm", statusColors[ticket.status])}>
              {statusIcons[ticket.status]}
              {ticket.status}
            </span>
            <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold border border-transparent", priorityColors[ticket.priority])}>
              {ticket.priority}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 leading-tight">{ticket.requester_name}</h3>
            <span className="text-sm text-slate-500 font-medium">{ticket.sector}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className="text-xs text-slate-500 font-medium bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {new Date(ticket.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={() => onDelete(ticket.id)}
            className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Excluir chamado"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 mb-6">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {ticket.description}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
           <span className="text-xs text-slate-600 font-mono">ID: {ticket.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-500 ml-1">Status</label>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
            className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer hover:bg-slate-900"
          >
            <option value="Aberto">Aberto</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-500 ml-1">Prioridade</label>
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(ticket.id, e.target.value as TicketPriority)}
            className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer hover:bg-slate-900"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
      </div>
    </div>
  );
}
