import { Button } from "@/components/ui/Button"
import { ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.2_0.1_250),transparent_50%)] opacity-50" />

      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <span className="text-primary font-medium">✨ Novo</span>
            <span className="text-muted-foreground">IA integrada para automação inteligente</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            A Plataforma Completa para <span className="text-primary">Transformar</span> seu Negócio
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Usado por empresas inovadoras, o Nexus System permite criar soluções de alta qualidade com o poder da
            automação inteligente e colaboração em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/ticket">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#recursos">
              <Button size="lg" variant="outline" className="group bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                Ver Demonstração
              </Button>
            </a>
          </div>

          <div className="pt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <code className="px-3 py-1 rounded bg-muted font-mono text-xs">npm install nexus-system</code>
          </div>
        </div>

        {/* Hero visual */}
        <div className="mt-20 relative">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-4 shadow-2xl">
            <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,oklch(0.3_0.15_250),transparent_70%)]" />
            </div>
          </div>
          {/* Floating cards */}
          <div className="absolute -left-4 top-1/4 hidden lg:block">
            <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-2 w-16 rounded bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-1/3 hidden lg:block">
            <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
              <div className="space-y-2">
                <div className="h-2 w-32 rounded bg-accent/60" />
                <div className="h-2 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
