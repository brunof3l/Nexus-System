import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.5_0.2_250),transparent_50%)] opacity-20" />

          <div className="relative space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Pronto para Transformar seu Negócio?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Junte-se a milhares de empresas que já estão usando o Nexus System. Comece gratuitamente, sem cartão de
              crédito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/ticket">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Agendar Demonstração
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Grátis por 14 dias • Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
