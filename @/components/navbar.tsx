import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">Nexus</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#solucoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Soluções
              </a>
              <a href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
              <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Começar Grátis
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#recursos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#solucoes" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </a>
            <a href="#precos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#sobre" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Começar Grátis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
