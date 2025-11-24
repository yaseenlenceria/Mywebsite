import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import { Star } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/public/testimonials"],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Testimonials
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                What clients say about working with me
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-6xl px-6">
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="h-20 w-full animate-pulse rounded bg-muted mb-4" />
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 w-1/3 animate-pulse rounded bg-muted mb-2" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="hover-elevate border-l-4 border-l-primary" data-testid={`card-testimonial-${testimonial.id}`}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex gap-1">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="mb-6 text-muted-foreground italic text-lg" data-testid={`text-quote-${testimonial.id}`}>
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        {testimonial.clientPhoto ? (
                          <img
                            src={testimonial.clientPhoto}
                            alt={testimonial.clientName}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            {testimonial.clientName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-lg" data-testid={`text-client-name-${testimonial.id}`}>
                            {testimonial.clientName}
                          </p>
                          {testimonial.clientCompany && (
                            <p className="text-sm text-muted-foreground" data-testid={`text-company-${testimonial.id}`}>
                              {testimonial.clientCompany}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Star className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No Testimonials Yet</h3>
                <p className="text-muted-foreground">
                  Client testimonials will be displayed here
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
