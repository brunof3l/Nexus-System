import { supabase } from '../lib/supabase';
import type { Ticket, TicketStatus, TicketPriority } from '../types';

const LOCAL_STORAGE_KEY = 'tickets_local_backup';

export interface CreateTicketData {
  requester_name: string;
  description: string;
  sector: string;
  priority: TicketPriority;
}

export const ticketService = {
  async createTicket(ticketData: CreateTicketData): Promise<Ticket | null> {
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      requester_name: ticketData.requester_name,
      description: ticketData.description,
      sector: ticketData.sector,
      status: 'Aberto',
      priority: ticketData.priority,
    };

    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('tickets')
          .insert([
            {
              requester_name: ticketData.requester_name,
              description: ticketData.description,
              sector: ticketData.sector,
              priority: ticketData.priority,
              status: 'Aberto'
            }
          ])
          .select()
          .single();
        
        if (error) throw error;
        return data as Ticket;
      }
    } catch (error) {
      console.warn('Supabase error or not configured, falling back to LocalStorage', error);
    }

    // Fallback to LocalStorage
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    stored.push(newTicket);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));
    return newTicket;
  },

  async getTickets(): Promise<Ticket[]> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Ticket[];
      }
    } catch (error) {
      console.warn('Supabase error or not configured, using LocalStorage', error);
    }

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    // Sort by id descending (simulating DB behavior)
    return stored.sort((a: Ticket, b: Ticket) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
    });
  },

  async updateTicketStatus(id: string, newStatus: TicketStatus): Promise<void> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('tickets')
          .update({ status: newStatus })
          .eq('id', id);
        
        if (error) throw error;
        return;
      }
    } catch (error) {
      console.warn('Using LocalStorage update', error);
    }

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = stored.map((t: Ticket) => t.id === id ? { ...t, status: newStatus } : t);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async updateTicketPriority(id: string, newPriority: TicketPriority): Promise<void> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('tickets')
          .update({ priority: newPriority })
          .eq('id', id);
        
        if (error) throw error;
        return;
      }
    } catch (error) {
      console.warn('Using LocalStorage update', error);
    }

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = stored.map((t: Ticket) => t.id === id ? { ...t, priority: newPriority } : t);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  },

  async deleteTicket(id: string): Promise<void> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('tickets')
          .delete()
          .eq('id', id);
      
        if (error) throw error;
        return;
      }
    } catch (error) {
      console.warn('Using LocalStorage delete', error);
    }

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = stored.filter((t: Ticket) => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};
