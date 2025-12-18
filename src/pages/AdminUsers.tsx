import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, User, Mail, Shield, Trash2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Support' | 'Viewer';
  status: 'Active' | 'Inactive';
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Support' });

  useEffect(() => {
    // Load users from localStorage or set defaults
    const storedUsers = localStorage.getItem('nexus_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers: UserData[] = [
        { id: '1', name: 'Administrador', email: 'admin@nexus.com', role: 'Admin', status: 'Active' },
        { id: '2', name: 'Suporte Técnico', email: 'suporte@nexus.com', role: 'Support', status: 'Active' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('nexus_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserData = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: 'Active'
    };
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Support' });
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Remover este usuário?')) {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Equipe</h1>
            <p className="text-slate-400">Gerencie os usuários e permissões do sistema</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-6 bg-slate-900/50 border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                  {user.status === 'Active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 mb-4">
                <Mail className="w-3 h-3" /> {user.email}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Badge variant="outline" className="border-slate-700 text-slate-300">
                  <Shield className="w-3 h-3 mr-1" /> {user.role}
                </Badge>
                {user.role !== 'Admin' && (
                    <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Simple Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md p-6 bg-slate-900 border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Adicionar Membro</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nome</label>
                  <Input 
                    required
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <Input 
                    required
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Função</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Support">Suporte</option>
                    <option value="Viewer">Visualizador</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
