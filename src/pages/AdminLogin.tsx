import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        if (password === 'admin123') {
        localStorage.setItem('admin_auth', 'true');
        navigate('/admin/dashboard');
        } else {
        alert('Senha incorreta');
        setLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </Link>
      </div>

      <Card className="w-full max-w-md p-8 bg-[#1e293b]/70 backdrop-blur-xl border-white/10">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <ShieldCheck className="w-12 h-12 text-indigo-400" />
          </div>
        </div>
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Acesso Administrativo</h1>
            <p className="text-slate-400 text-sm">
            Entre com suas credenciais para acessar o painel.
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Chave de Acesso"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            className="bg-[#0f172a]/50 border-white/5 focus:border-indigo-400"
          />

          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-500"
            isLoading={loading}
          >
            Entrar no Sistema
          </Button>
        </form>
      </Card>
    </div>
  );
}
