import { useState } from 'react';
import { ticketService } from '../services/ticketService';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import type { TicketPriority } from '../types';

export function TicketForm() {
  const [solicitante, setSolicitante] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState('');
  const [prioridade, setPrioridade] = useState<TicketPriority>('Baixa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solicitante.trim() || !descricao.trim() || !setor.trim()) return;

    setIsSubmitting(true);
    await ticketService.createTicket({
      requester_name: solicitante,
      description: descricao,
      sector: setor,
      priority: prioridade
    });
    setIsSubmitting(false);
    setSuccess(true);
    
    // Reset form
    setSolicitante('');
    setDescricao('');
    setSetor('');
    setPrioridade('Baixa');

    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const setores = [
    'Financeiro',
    'RH',
    'Recepção',
    'TI',
    'Vendas',
    'Operacional',
    'Outros'
  ];

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Abrir Chamado</h2>
        <p className="text-slate-500 mt-2 text-sm">Descreva seu problema abaixo</p>
      </div>

      {success ? (
        <div className="bg-emerald-950/30 border border-emerald-900 text-emerald-400 p-8 rounded-xl flex flex-col items-center justify-center space-y-3 animate-fade-in text-center">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <span className="block font-bold text-lg text-emerald-400">Chamado enviado!</span>
            <span className="text-emerald-600/80 text-sm">Um técnico irá atendê-lo em breve.</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="solicitante" className="block text-sm font-medium text-slate-400 mb-1.5">Seu Nome</label>
            <input
              id="solicitante"
              type="text"
              required
              className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-600 sm:text-sm p-3 transition-colors"
              placeholder="Ex: João Silva"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="setor" className="block text-sm font-medium text-slate-400 mb-1.5">Setor</label>
              <select
                id="setor"
                required
                className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm p-3 transition-colors appearance-none"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
              >
                <option value="" className="text-slate-500">Selecione...</option>
                {setores.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-slate-400 mb-1.5">Prioridade</label>
              <select
                id="prioridade"
                required
                className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm p-3 transition-colors appearance-none"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as TicketPriority)}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-slate-400 mb-1.5">Descrição</label>
            <textarea
              id="descricao"
              required
              rows={4}
              className="block w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-600 sm:text-sm p-3 transition-colors resize-none"
              placeholder="Descreva detalhadamente o problema..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Abrir Chamado
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
