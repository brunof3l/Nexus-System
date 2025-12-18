export function Footer() {
  const footerLinks = {
    produto: [
      { label: "Recursos", href: "#recursos" },
      { label: "Preços", href: "#precos" },
      { label: "Segurança", href: "#seguranca" },
      { label: "Roadmap", href: "#roadmap" },
    ],
    empresa: [
      { label: "Sobre", href: "#sobre" },
      { label: "Blog", href: "#blog" },
      { label: "Carreiras", href: "#carreiras" },
      { label: "Imprensa", href: "#imprensa" },
    ],
    recursos: [
      { label: "Documentação", href: "#docs" },
      { label: "API", href: "#api" },
      { label: "Comunidade", href: "#comunidade" },
      { label: "Suporte", href: "#suporte" },
    ],
    legal: [
      { label: "Privacidade", href: "#privacidade" },
      { label: "Termos", href: "#termos" },
      { label: "Cookies", href: "#cookies" },
      { label: "Licenças", href: "#licencas" },
    ],
  }

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">Nexus</span>
            </a>
            <p className="text-sm text-muted-foreground">A plataforma completa para transformar seu negócio.</p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Nexus System. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
