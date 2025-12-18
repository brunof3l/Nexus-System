export function Stats() {
  const stats = [
    { value: "98%", label: "Satisfação dos clientes", company: "TechCorp" },
    { value: "50%", label: "Mais rápido no mercado", company: "StartupXYZ" },
    { value: "300%", label: "Aumento em produtividade", company: "InnovateInc" },
    { value: "24/7", label: "Suporte dedicado", company: "GlobalSoft" },
  ]

  return (
    <section className="py-20 border-y border-border/40 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground/60 font-mono">{stat.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
