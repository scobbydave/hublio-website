import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Gold Fields Ltd",
    role: "Operations Manager",
    content:
      "Hublio's AI solutions have revolutionized our mining operations. We've seen a 30% increase in efficiency and significant cost savings.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    company: "Anglo American",
    role: "Safety Director",
    content:
      "The predictive safety features have helped us prevent multiple incidents. This technology is a game-changer for mining safety.",
    rating: 5,
  },
  {
    name: "David Mbeki",
    company: "Sibanye-Stillwater",
    role: "Technical Manager",
    content:
      "The real-time analytics and insights have given us unprecedented visibility into our operations. Highly recommended.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">Trusted by leading mining companies across South Africa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
