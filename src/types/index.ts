export type TicketStatus = 'Aberto' | 'Em Andamento' | 'Concluído';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta';

export interface Ticket {
  id: string;
  created_at: string;
  requester_name: string;
  sector: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
}
