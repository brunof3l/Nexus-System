import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  Hexagon, Send, Lock, ExternalLink, Trash2, ArrowLeft, RefreshCw, 
  CheckCircle, AlertTriangle, LayoutDashboard, List, History, 
  FileText, X, Save, Clock, AlertCircle
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'

// --- 🔌 SUAS CHAVES DO SUPABASE ---
const supabaseUrl = 'https://oaypoiguixyayqkdgflx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heXBvaWd1aXh5YXlxa2RnZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTUzODQsImV4cCI6MjA4MTQ5MTM4NH0.vuCvPKZZ74qxvSRAnCVeepZeQi2UE_qfIFmWGAaOA7E'

const supabase = createClient(supabaseUrl, supabaseKey)

// Cores para os gráficos
const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

export default function App() {
  const [currentView, setCurrentView] = useState('home')
  const [adminTab, setAdminTab] = useState('dashboard')
  
  // Dados do Formulário Público
  const [formData, setFormData] = useState({
    nome: '', setor: '', prioridade: 'Baixa', descricao: '', codigo: ''
  })
  
  // Estados Gerais
  const [status, setStatus] = useState('idle')
  const [adminPin, setAdminPin] = useState('')
  const [tickets, setTickets] = useState([]) 
  const [loadingTickets, setLoadingTickets] = useState(false)
  
  // Modal de Edição
  const [editingTicket, setEditingTicket] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // --- COMPONENTE: CONTADOR DE TEMPO (NOVO) ---
  const TicketTimer = ({ createdAt, priority, status }) => {
    // Definição das horas de prazo por prioridade
    const slaHours = { 'Alta': 4, 'Média': 24, 'Baixa': 48 }
    const hoursAllowed = slaHours[priority] || 48
    
    // Calcula o prazo final
    const deadline = new Date(new Date(createdAt).getTime() + hoursAllowed * 60 * 60 * 1000)
    
    const [timeLeft, setTimeLeft] = useState('')
    const [isOverdue, setIsOverdue] = useState(false)

    useEffect(() => {
      // Se já concluiu, não conta mais
      if (status === 'Concluído') return 

      const calculateTime = () => {
        const now = new Date()
        const diff = deadline - now

        if (diff <= 0) {
          setIsOverdue(true)
          setTimeLeft('ATRASADO')
        } else {
          setIsOverdue(false)
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${hours}h ${minutes}m`)
        }
      }

      calculateTime()
      const timer = setInterval(calculateTime, 60000) // Atualiza a cada minuto
      return () => clearInterval(timer)
    }, [createdAt, priority, status])

    if (status === 'Concluído') return <span className="text-green-500 font-bold text-xs">Resolvido</span>

    return (
      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded border ${
        isOverdue 
          ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' 
          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      }`}>
        <Clock className="w-3 h-3" />
        {timeLeft}
      </div>
    )
  }
  // ---------------------------------------------

  const stats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter(t => t.status !== 'Concluído').length
    const solved = tickets.filter(t => t.status === 'Concluído').length
    
    const sectorCount = tickets.reduce((acc, curr) => {
      acc[curr.sector] = (acc[curr.sector] || 0) + 1
      return acc
    }, {})
    const sectorData = Object.keys(sectorCount).map(key => ({ name: key, value: sectorCount[key] }))

    const statusCount = [
      { name: 'Aberto', value: tickets.filter(t => t.status === 'Aberto').length },
      { name: 'Andamento', value: tickets.filter(t => t.status === 'Em Andamento').length },
      { name: 'Concluído', value: tickets.filter(t => t.status === 'Concluído').length },
    ]

    return { total, open, solved, sectorData, statusCount }
  }, [tickets])

  const handleNavigation = (view) => {
    setCurrentView(view)
    setStatus('idle')
    if (view === 'admin') fetchTickets()
  }

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handlePublicSubmit = async (e) => {
    e.preventDefault()
    if (formData.codigo !== 'ls6043') {
      alert('⛔ Código de Acesso incorreto!')
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('tickets').insert([{
      requester_name: formData.nome,
      sector: formData.setor,
      priority: formData.prioridade,
      description: formData.descricao,
      status: 'Aberto'
    }])
    if (error) {
      alert('Erro ao abrir chamado.')
      setStatus('idle')
    } else {
      setStatus('success')
      setTimeout(() => {
         setStatus('idle')
         setFormData({ nome: '', setor: '', prioridade: 'Baixa', descricao: '', codigo: '' })
      }, 3000)
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (adminPin === 'ls6043') handleNavigation('admin')
    else alert('Senha Incorreta!')
  }

  const fetchTickets = async () => {
    setLoadingTickets(true)
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setTickets(data || [])
    setLoadingTickets(false)
  }

  const openEditModal = (ticket) => {
    setEditingTicket({ ...ticket })
    setModalOpen(true)
  }

  const saveTicketChanges = async () => {
    if (!editingTicket) return
    setTickets(tickets.map(t => t.id === editingTicket.id ? editingTicket : t))
    setModalOpen(false)
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: editingTicket.status,
        technical_notes: editingTicket.technical_notes
      })
      .eq('id', editingTicket.id)
    if (error) {
      alert('Erro ao salvar.')
      fetchTickets()
    }
  }

  const deleteTicket = async (id) => {
    if (!confirm('Excluir este chamado permanentemente?')) return
    setTickets(tickets.filter(t => t.id !== id))
    await supabase.from('tickets').delete().eq('id', id)
  }

  const TicketModal = () => {
    if (!modalOpen || !editingTicket) return null
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="text-cyan-400" /> Detalhes do Chamado #{editingTicket.id}
            </h3>
            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Solicitante</span>
                <p className="text-white text-lg">{editingTicket.requester_name}</p>
                <span className="text-sm text-cyan-400">{editingTicket.sector}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Descrição do Problema</span>
                <p className="text-gray-300 text-sm leading-relaxed">{editingTicket.description}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Tempo Restante (SLA)</span>
                <div className="w-fit">
                   <TicketTimer createdAt={editingTicket.created_at} priority={editingTicket.priority} status={editingTicket.status} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Status Atual</label>
                <select 
                  value={editingTicket.status}
                  onChange={(e) => setEditingTicket({...editingTicket, status: e.target.value})}
                  className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                >
                  <option value="Aberto">🟢 Aberto</option>
                  <option value="Em Andamento">🟡 Em Andamento</option>
                  <option value="Concluído">⚪ Concluído</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Observações do Técnico</label>
                <textarea 
                  value={editingTicket.technical_notes || ''}
                  onChange={(e) => setEditingTicket({...editingTicket, technical_notes: e.target.value})}
                  placeholder="Descreva a solução ou notas internas..."
                  rows="5"
                  className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-white/5 flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
            <button onClick={saveTicketChanges} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20">
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    )
  }

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total de Chamados</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><List /></div>
          </div>
        </div>
        <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pendentes</p>
              <h3 className="text-4xl font-bold text-yellow-400 mt-2">{stats.open}</h3>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400"><AlertTriangle /></div>
          </div>
        </div>
        <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Concluídos</p>
              <h3 className="text-4xl font-bold text-green-400 mt-2">{stats.solved}</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><CheckCircle /></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5">
          <h4 className="text-white font-bold mb-6">Status dos Chamados</h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.statusCount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color:'#fff'}} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5">
          <h4 className="text-white font-bold mb-6">Chamados por Setor</h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={stats.sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {stats.sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color:'#fff'}} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  const TicketTable = ({ filter }) => {
    const filteredTickets = tickets.filter(filter)
    return (
      <div className="bg-[#1e293b]/30 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0f172a] text-gray-200 uppercase font-bold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Status & SLA</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4 w-1/3">Problema</th>
                <th className="px-6 py-4 w-1/4">Obs. Técnica</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets.length === 0 ? (
                 <tr><td colSpan="5" className="p-12 text-center text-gray-500">Nenhum registro encontrado.</td></tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => openEditModal(ticket)}>
                    <td className="px-6 py-4 space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        ticket.status === 'Aberto' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        ticket.status === 'Em Andamento' ? 'text-yellow-400 border-yellow-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                      {/* O CONTADOR DE TEMPO AQUI */}
                      <TicketTimer createdAt={ticket.created_at} priority={ticket.priority} status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{ticket.requester_name}</div>
                      <div className="text-xs text-gray-500">{ticket.sector}</div>
                      <div className={`text-[10px] font-bold mt-1 ${ticket.priority === 'Alta' ? 'text-red-400' : 'text-gray-500'}`}>
                        Prioridade: {ticket.priority}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 line-clamp-2">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.technical_notes ? (
                        <p className="text-cyan-200/80 text-xs italic line-clamp-2">"{ticket.technical_notes}"</p>
                      ) : (
                        <span className="text-gray-600 text-xs italic">Sem observações...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                       <button onClick={() => deleteTicket(ticket.id)} className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderAdminLayout = () => (
    <div className="flex flex-col h-screen overflow-hidden bg-[#020817]">
      <header className="h-16 bg-[#0f172a] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500/10 p-2 rounded-lg"><LayoutDashboard className="text-cyan-400 w-5 h-5"/></div>
          <h1 className="text-white font-bold text-lg hidden md:block">Nexus Admin <span className="text-gray-500 font-normal">| Gestão Técnica</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchTickets} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`}/> Atualizar
          </button>
          <button onClick={() => handleNavigation('home')} className="text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4"/> Sair
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-[#0f172a]/50 border-r border-white/5 hidden md:flex flex-col p-4 gap-2">
          <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard Geral
          </button>
          <button onClick={() => setAdminTab('active')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <List className="w-4 h-4" /> Chamados Ativos
            {stats.open > 0 && <span className="ml-auto bg-cyan-500 text-[#020817] text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.open}</span>}
          </button>
          <button onClick={() => setAdminTab('history')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'history' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <History className="w-4 h-4" /> Histórico Concluído
          </button>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
           {adminTab === 'dashboard' && <DashboardView />}
           {adminTab === 'active' && (
             <div className="space-y-4 animate-in fade-in">
                <h2 className="text-2xl font-bold text-white mb-4">Fila de Atendimento</h2>
                <TicketTable filter={t => t.status !== 'Concluído'} />
             </div>
           )}
           {adminTab === 'history' && (
             <div className="space-y-4 animate-in fade-in">
                <h2 className="text-2xl font-bold text-white mb-4">Histórico de Resoluções</h2>
                <TicketTable filter={t => t.status === 'Concluído'} />
             </div>
           )}
        </main>
      </div>
      <TicketModal />
    </div>
  )

  const renderHome = () => (
    <div className="min-h-screen bg-[#020817] text-white font-sans flex flex-col">
       <nav className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-[#0ea5e9]/10 rounded-lg group-hover:bg-[#0ea5e9]/20 transition-colors">
              <Hexagon className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <span className="text-xl font-bold tracking-tight">NEXUS</span>
          </div>
          <button onClick={() => handleNavigation('login')} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-2 hover:bg-white/5 rounded-lg text-sm font-medium">
             Área Técnica <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0ea5e9] rounded-full blur-[128px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[128px] opacity-10 pointer-events-none"></div>
        <div className="w-full max-w-lg bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in">
          <div className="p-8 pb-0 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Central de Ajuda</h1>
            <p className="text-gray-400 text-sm">Preencha o formulário para abrir um chamado técnico.</p>
          </div>
          <div className="p-8">
            {status === 'success' ? (
              <div className="py-12 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <Send className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Chamado Enviado!</h2>
                <p className="text-gray-400">Sua solicitação já está no nosso sistema.</p>
              </div>
            ) : (
              <form onSubmit={handlePublicSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Seu Nome</label>
                  <input required type="text" name="nome" value={formData.nome} onChange={handleFormChange} placeholder="Ex: Ana Souza" className="w-full bg-[#1e293b]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Setor</label>
                    <select required name="setor" value={formData.setor} onChange={handleFormChange} className="w-full bg-[#1e293b]/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer">
                      <option value="" disabled>Selecione...</option>
                      <option value="ADM">Administrativo</option>
                      <option value="FIN">Financeiro</option>
                      <option value="COM">Comercial</option>
                      <option value="TI">TI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prioridade</label>
                    <select name="prioridade" value={formData.prioridade} onChange={handleFormChange} className="w-full bg-[#1e293b]/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer">
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
                  <textarea required name="descricao" rows="4" value={formData.descricao} onChange={handleFormChange} placeholder="Explique o problema..." className="w-full bg-[#1e293b]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"></textarea>
                </div>
                <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
                  <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                    <Lock className="w-3 h-3" /> Código de Acesso
                  </label>
                  <input required type="password" name="codigo" value={formData.codigo} onChange={handleFormChange} placeholder="Código da empresa" className="w-full bg-[#020817] border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-all tracking-widest text-center" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {status === 'loading' ? 'Enviando...' : <><Send className="w-5 h-5" /> Abrir Chamado</>}
                </button>
              </form>
            )}
          </div>
          <div className="bg-[#020817]/50 p-4 text-center border-t border-white/5">
            <p className="text-xs text-gray-500">Nexus Internal System © 2025</p>
          </div>
        </div>
      </main>
    </div>
  )

  const renderLogin = () => (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Área Técnica Restrita</h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input type="password" placeholder="Senha de Acesso" className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none text-center tracking-widest text-xl" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20">Acessar Painel</button>
        </form>
        <button onClick={() => handleNavigation('home')} className="mt-6 text-gray-500 hover:text-white text-sm underline-offset-4 hover:underline">Voltar para o Início</button>
      </div>
    </div>
  )

  return (
    <>
      {currentView === 'home' && renderHome()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'admin' && renderAdminLayout()}
    </>
  )
}