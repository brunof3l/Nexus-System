import { Link, Outlet, useLocation } from 'react-router-dom';
import { Hexagon, Terminal, Ticket } from 'lucide-react';
import clsx from 'clsx';

export function Layout() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-800 group-hover:border-violet-500/50 transition-colors">
              <Hexagon className="w-6 h-6 text-violet-500 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">
              NEXUS
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              to="/" 
              className={clsx(
                "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                location.pathname === '/' 
                  ? "text-sky-400 bg-sky-950/30 font-medium" 
                  : "text-slate-400 hover:text-sky-400"
              )}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Abrir Chamado
            </Link>
            
            <span className="text-slate-700">/</span>

            <Link 
              to="/admin" 
              className={clsx(
                "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                isAdminSection 
                  ? "text-violet-400 bg-violet-950/30 font-medium" 
                  : "text-slate-400 hover:text-violet-400 decoration-slate-700 underline-offset-4 hover:underline"
              )}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Área Técnica
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Nexus Internal System © 2025
          </p>
          <p className="text-slate-600 text-xs mt-2">
            v1.0.0 • Agile Helpdesk Solution
          </p>
        </div>
      </footer>
    </div>
  );
}
