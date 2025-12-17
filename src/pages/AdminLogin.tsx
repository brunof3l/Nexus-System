import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Senha incorreta');
    }
  };

  return (
    <div className="flex items-center justify-center py-20 animate-fade-in">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-center text-white tracking-tight">Acesso Restrito</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Área exclusiva para técnicos e administradores do Nexus.
        </p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Chave de Acesso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 rounded-xl bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 py-3 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-900/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Autenticar
          </button>
        </form>
      </div>
    </div>
  );
}
