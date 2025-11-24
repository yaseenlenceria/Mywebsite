import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Code,
  TrendingUp,
  Sparkles,
  ShoppingCart,
  Search,
  Palette,
  Zap,
  FileCode,
  BarChart,
  MessageSquare,
  Rocket,
  Shield,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      features: [
        "React/Next.js applications",
        "Full-stack development",
        "Responsive design",
        "API integration",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Shopify Development",
      description: "Professional e-commerce solutions on Shopify",
      features: [
        "Custom Shopify themes",
        "App development",
        "Store optimization",
        "Payment integration",
      ],
    },
    {
      icon: TrendingUp,
      title: "SEO Optimization",
      description: "Drive organic traffic and improve search rankings",
      features: [
        "Technical SEO audit",
        "Keyword research",
        "Content optimization",
        "Link building",
      ],
    },
    {
      icon: Sparkles,
      title: "AI Integration",
      description: "Enhance applications with AI capabilities",
      features: [
        "ChatGPT integration",
        "AI-powered features",
        "Automation solutions",
        "Custom AI models",
      ],
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, user-friendly interface design",
      features: [
        "Modern UI design",
        "User experience optimization",
        "Prototyping",
        "Design systems",
      ],
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Data-driven insights for business growth",
      features: [
        "Google Analytics setup",
        "Custom dashboards",
        "Performance tracking",
        "Conversion optimization",
      ],
    },
  ];

  const process = [
    {
      icon: MessageSquare,
      title: "1. Consultation",
      description: "We discuss your project requirements and goals in detail",
    },
    {
      icon: FileCode,
      title: "2. Planning",
      description: "I create a detailed project plan and timeline",
    },
    {
      icon: Zap,
      title: "3. Development",
      description: "Building your solution with regular updates and feedback",
    },
    {
      icon: Rocket,
      title: "4. Launch",
      description: "Deploying your project and ensuring everything works perfectly",
    },
    {
      icon: Shield,
      title: "5. Support",
      description: "Ongoing maintenance and support as needed",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Services
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Professional development and digital marketing services tailored to your business needs
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">What I Offer</h2>
              <p className="text-lg text-muted-foreground">Comprehensive services to help your business grow</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="hover-elevate" data-testid={`card-service-${index}`}>
                    <CardHeader>
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-muted-foreground">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How I Work</h2>
              <p className="text-lg text-muted-foreground">My streamlined process for project success</p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-6">
                {process.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="hover-elevate">
                      <CardContent className="flex items-start gap-6 p-6">
                        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Get Started?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Let's discuss your project and find the perfect solution for your needs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild data-testid="button-contact">
                <Link href="/contact">
                  <a>Contact Me</a>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-portfolio">
                <Link href="/portfolio">
                  <a>View Portfolio</a>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
