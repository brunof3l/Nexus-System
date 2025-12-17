import { useState } from 'react'
import { Hexagon, Send, Ticket, ExternalLink, CheckCircle } from 'lucide-react'

export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    setor: '',
    prioridade: 'Baixa',
    descricao: ''
  })
  
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulação
    setTimeout(() => {
       setStatus('success')
       setTimeout(() => {
         setStatus('idle')
         setFormData({ nome: '', setor: '', prioridade: 'Baixa', descricao: '' })
       }, 3000)
    }, 1500)
  }

  // Estilos base para inputs
  const inputClass = "w-full bg-[#1E293B] text-gray-100 border border-[#334155] rounded-[35px] px-6 py-3 focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all placeholder-gray-500 appearance-none outline-none"
  const labelClass = "block text-sm font-medium text-gray-400 mb-2 ml-1"

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 font-sans flex flex-col">
      
      {/* Background Decorativo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0EA5E9] rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      </div>

      {/* HEADER - Ajustado com margens laterais (px-8) */}
      <nav className="relative z-10 border-b border-[#1E293B] bg-[#0B1120]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
              <Hexagon className="w-7 h-7 text-[#0EA5E9]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">NEXUS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="text-[#0EA5E9] font-semibold transition-colors">Abrir Chamado</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
              Área Técnica <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT - Recuo de 280px nas laterais */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 px-[280px]">
        
        {/* UNIFIED CONTAINER */}
        <div className="w-full bg-[#161F32]/90 backdrop-blur-xl border border-[#334155] rounded-[50px] shadow-2xl p-[30px]">
          
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
              
              {/* Nome */}
              <div>
                <label className={labelClass}>Seu Nome</label>
                <input 
                  required type="text" name="nome"
                  value={formData.nome} onChange={handleChange}
                  placeholder="Ex: Ana Souza"
                  className={inputClass}
                />
              </div>

              {/* Grid Setor e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Setor</label>
                  <div className="relative">
                    <select 
                      required name="setor"
                      value={formData.setor} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" disabled>Selecione...</option>
                      <option value="Administrativo">Administrativo</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Comercial">Comercial</option>
                      <option value="TI">TI</option>
                    </select>
                    {/* Seta Customizada */}
                    <div className="absolute right-4 top-4 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>Prioridade</label>
                   <div className="relative">
                    <select 
                        name="prioridade"
                        value={formData.prioridade} onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                      </select>
                      <div className="absolute right-4 top-4 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                   </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className={labelClass}>Descrição do Problema</label>
                <textarea 
                  required name="descricao" rows="4"
                  value={formData.descricao} onChange={handleChange}
                  placeholder="Explique o que aconteceu com o máximo de detalhes..."
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              {/* Botão com margem superior extra (mt-2) */}
              <button 
                type="submit" disabled={status === 'loading'}
                className="w-full mt-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-4 rounded-[35px] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <> <Send className="w-5 h-5" /> Abrir Chamado </>
                )}
              </button>

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