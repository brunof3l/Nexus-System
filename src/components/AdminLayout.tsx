import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Ticket, Settings, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Ticket, label: 'Chamados', path: '/admin/tickets' },
    { icon: Users, label: 'Equipe', path: '/admin/users' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#161F32] border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
           <span className="text-xl font-bold text-white tracking-tight">NEXUS <span className="text-indigo-500">ADMIN</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path === '/admin/tickets' ? '/admin/dashboard' : item.path} // Redirect all to dashboard for now
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin/dashboard')
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#161F32] border-b border-slate-800 flex items-center justify-between px-4 z-30">
          <span className="font-bold text-white">NEXUS</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
