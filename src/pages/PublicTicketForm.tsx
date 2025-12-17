import { TicketForm } from '../components/TicketForm';

export function PublicTicketForm() {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Central de Ajuda
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Está com problemas? Preencha o formulário abaixo e nossa equipe técnica entrará em ação o mais rápido possível.
          </p>
        </div>
        
        <TicketForm />
      </div>
    </div>
  );
}
