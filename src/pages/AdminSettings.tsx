import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, Bell, Moon, Globe, Shield } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    systemName: 'Nexus System',
    supportEmail: 'suporte@nexus.com',
    notifications: true,
    darkMode: true,
    language: 'pt-BR'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nexus_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nexus_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-slate-400">Personalize o comportamento e aparência do sistema</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Geral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Nome do Sistema</label>
                <Input 
                  value={settings.systemName}
                  onChange={e => setSettings({...settings, systemName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email de Suporte</label>
                <Input 
                  type="email"
                  value={settings.supportEmail}
                  onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              Notificações e Aparência
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-white font-medium">Notificações por Email</p>
                        <p className="text-xs text-slate-500">Receber alertas sobre novos chamados</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications}
                    onChange={e => setSettings({...settings, notifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-white font-medium">Modo Escuro</p>
                        <p className="text-xs text-slate-500">Tema padrão do sistema</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.darkMode}
                    onChange={e => setSettings({...settings, darkMode: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={saved} className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
              {saved ? 'Salvo com Sucesso!' : (
                <>
                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
