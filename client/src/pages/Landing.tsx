import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, TrendingUp, Sparkles, MessageSquare, Phone } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project, Testimonial } from "@shared/schema";

export default function Landing() {
  const { data: currentProjects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/public/current-projects"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/public/testimonials"],
  });

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="container relative mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-6 px-4 py-1 text-sm" variant="outline" data-testid="badge-role">
                Available for Hire
              </Badge>
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Shopify Expert
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  SEO Specialist
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl">AI Web App Developer</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Building high-performance web applications with modern technologies. Helping businesses grow with SEO-optimized solutions and AI-powered experiences.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild data-testid="button-hire-me">
                  <Link href="/contact">
                    <a className="flex items-center gap-2">
                      Hire Me <ArrowRight className="h-4 w-4" />
                    </a>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-view-portfolio">
                  <Link href="/portfolio">
                    <a>View Portfolio</a>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-whatsapp">
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Current Projects I'm Working On</h2>
              <p className="text-lg text-muted-foreground">Real-time updates from my dashboard</p>
            </div>

            {projectsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="h-48 w-full animate-pulse rounded-md bg-muted mb-4" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-2" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : currentProjects && currentProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentProjects.map((project) => (
                  <Card key={project.id} className="hover-elevate" data-testid={`card-project-${project.id}`}>
                    <CardContent className="p-6">
                      {project.coverImage && (
                        <div className="mb-4 h-48 w-full overflow-hidden rounded-md bg-muted">
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={`mb-3 ${statusColors[project.status as keyof typeof statusColors] || statusColors.pending}`}
                        data-testid={`badge-status-${project.id}`}
                      >
                        {project.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <h3 className="mb-2 text-xl font-semibold" data-testid={`text-title-${project.id}`}>
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-description-${project.id}`}>
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No current projects to display</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">What Clients Say</h2>
              <p className="text-lg text-muted-foreground">Testimonials from satisfied clients</p>
            </div>

            {testimonialsLoading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="h-20 w-full animate-pulse rounded bg-muted mb-4" />
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
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
                {testimonials.slice(0, 4).map((testimonial) => (
                  <Card key={testimonial.id} className="hover-elevate border-l-4 border-l-primary" data-testid={`card-testimonial-${testimonial.id}`}>
                    <CardContent className="p-6">
                      <p className="mb-4 text-muted-foreground italic" data-testid={`text-quote-${testimonial.id}`}>
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        {testimonial.clientPhoto && (
                          <img
                            src={testimonial.clientPhoto}
                            alt={testimonial.clientName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold" data-testid={`text-client-name-${testimonial.id}`}>
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
              <div className="text-center py-12">
                <p className="text-muted-foreground">No testimonials available yet</p>
              </div>
            )}

            {testimonials && testimonials.length > 4 && (
              <div className="mt-8 text-center">
                <Button variant="outline" asChild data-testid="button-view-testimonials">
                  <Link href="/testimonials">
                    <a>View All Testimonials</a>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Services I Offer</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="hover-elevate">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Web Development</h3>
                  <p className="text-muted-foreground">
                    Custom web applications built with modern frameworks and best practices for optimal performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">SEO Optimization</h3>
                  <p className="text-muted-foreground">
                    Drive organic traffic with technical SEO, content optimization, and strategic link building.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">AI Integration</h3>
                  <p className="text-muted-foreground">
                    Enhance your applications with cutting-edge AI capabilities for automation and insights.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild data-testid="button-view-services">
                <Link href="/services">
                  <a>View All Services</a>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <MessageSquare className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Start Your Project?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Let's discuss how I can help bring your ideas to life with professional development services.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild data-testid="button-contact-cta">
                <Link href="/contact">
                  <a>Get in Touch</a>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-book-call">
                <a href="#">Book a Call</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
