import { Card } from "@/components/ui/card"
import { Zap, Shield, Users, Workflow, BarChart3, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Velocidade Extrema",
      description:
        "Processamento em tempo real com latência ultra-baixa. Entregue resultados instantâneos para seus usuários.",
    },
    {
      icon: Shield,
      title: "Segurança de Nível Enterprise",
      description: "Proteção de dados end-to-end com criptografia avançada. Conformidade total com LGPD e GDPR.",
    },
    {
      icon: Users,
      title: "Colaboração Perfeita",
      description: "Trabalhe em equipe com sincronização em tempo real. Compartilhe, comente e itere mais rápido.",
    },
    {
      icon: Workflow,
      title: "Automação Inteligente",
      description: "IA integrada para automatizar tarefas repetitivas. Foque no que realmente importa.",
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Insights profundos sobre seu negócio. Dashboards interativos e relatórios personalizados.",
    },
    {
      icon: Sparkles,
      title: "Experiência Premium",
      description: "Interface moderna e intuitiva. Design pensado para maximizar produtividade e satisfação.",
    },
  ]

  return (
    <section id="recursos" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Tudo que Você Precisa para <span className="text-primary">Inovar</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Ferramentas poderosas e recursos avançados para sua equipe criar, colaborar e entregar produtos
            excepcionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
