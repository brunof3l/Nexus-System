import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO, TechFlow",
      content:
        "O Nexus System transformou completamente nossa operação. Reduzimos custos em 40% e aumentamos a produtividade da equipe drasticamente.",
      rating: 5,
    },
    {
      name: "João Santos",
      role: "CTO, DataCorp",
      content:
        "A melhor plataforma de gestão que já usamos. A IA integrada economiza horas de trabalho manual todos os dias.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      role: "Product Manager, InnovateLab",
      content:
        "Interface incrível e recursos poderosos. Nossa equipe adotou o sistema em dias e os resultados foram imediatos.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Adorado por Milhares de <span className="text-primary">Empresas</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Veja o que nossos clientes têm a dizer sobre sua experiência com o Nexus System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3 pt-2">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
