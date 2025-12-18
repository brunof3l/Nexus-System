import { useState } from 'react'
import { Hexagon, Send, ExternalLink, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import type { TicketPriority } from '../types'

export function PublicTicketForm() {
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    prioridade: 'Baixa' as TicketPriority,
    descricao: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      await ticketService.createTicket({
        requester_name: formData.nome,
        sector: formData.setor,
        priority: formData.prioridade,
        description: formData.descricao
      })
      
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setFormData({ nome: '', setor: '', prioridade: 'Baixa', descricao: '' })
      }, 3000)
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 font-sans flex flex-col">
      {/* Background Decorativo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0EA5E9] rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      </div>

      {/* HEADER */}
      <nav className="relative z-10 border-b border-[#1E293B] bg-[#0B1120]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
              <Hexagon className="w-7 h-7 text-[#0EA5E9]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">NEXUS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <span className="text-[#0EA5E9] font-semibold transition-colors cursor-pointer">Abrir Chamado</span>
            <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-2">
              Área Técnica <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 px-4 md:px-8">
        
        {/* UNIFIED CONTAINER */}
        <div className="w-full max-w-2xl bg-[#1e293b]/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 p-8 md:p-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Central de Ajuda
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Descreva seu problema abaixo. Nossa equipe de TI será notificada imediatamente.
            </p>
          </div>
          
          {status === 'success' ? (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Chamado Enviado!</h2>
              <p className="text-gray-400">Aguarde, já estamos analisando sua solicitação.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <Input
                label="Seu Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Ana Souza"
                required
                className="bg-[#0f172a]/50 border-white/5 focus:border-cyan-400 focus:ring-cyan-500/50"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Setor"
                    name="setor"
                    value={formData.setor}
                    onChange={handleChange}
                    required
                    className="bg-[#0f172a]/50 border-white/5 focus:border-cyan-400 focus:ring-cyan-500/50"
                >
                    <option value="" disabled>Selecione...</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Controle de Frota">Controle de Frota</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Gerencia">Gerencia</option>
                    <option value="Home Care">Home Care</option>
                    <option value="Monitoramento">Monitoramento</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Regulação">Regulação</option>
                    <option value="Ti">Ti</option>
                </Select>

                <Select
                    label="Prioridade"
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="bg-[#0f172a]/50 border-white/5 focus:border-cyan-400 focus:ring-cyan-500/50"
                >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 ml-1">Descrição do Problema</label>
                <textarea 
                  required name="descricao" rows={4}
                  value={formData.descricao} onChange={handleChange}
                  placeholder="Explique o que aconteceu com o máximo de detalhes..."
                  className="w-full bg-[#0f172a]/50 text-slate-100 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all placeholder-slate-600 outline-none resize-none"
                ></textarea>
              </div>

              <Button 
                type="submit" 
                variant="gradient"
                size="lg"
                className="w-full mt-4"
                isLoading={status === 'loading'}
              >
                 <Send className="w-5 h-5 mr-2" /> Abrir Chamado
              </Button>

            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-gray-600 text-sm">
        <p>© 2025 Nexus Internal System</p>
      </footer>
    </div>
  )
}
