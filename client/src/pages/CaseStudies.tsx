import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export default function CaseStudies() {
  const caseStudies = [
    {
      id: "1",
      title: "E-commerce Store Optimization",
      client: "Fashion Retailer",
      description: "Complete redesign and optimization of an online fashion store, resulting in significant improvements in user engagement and sales.",
      coverImage: null,
      results: [
        { icon: TrendingUp, label: "Conversion Rate", value: "+45%", color: "text-green-600" },
        { icon: Users, label: "Traffic", value: "+120%", color: "text-blue-600" },
        { icon: DollarSign, label: "Revenue", value: "+85%", color: "text-purple-600" },
        { icon: Clock, label: "Load Time", value: "-60%", color: "text-orange-600" },
      ],
      tags: ["Shopify", "SEO", "Performance"],
    },
    {
      id: "2",
      title: "AI-Powered Customer Service",
      client: "SaaS Company",
      description: "Integration of AI chatbot to handle customer inquiries, reducing response time and improving customer satisfaction.",
      coverImage: null,
      results: [
        { icon: Clock, label: "Response Time", value: "-70%", color: "text-green-600" },
        { icon: Users, label: "Satisfaction", value: "+35%", color: "text-blue-600" },
        { icon: DollarSign, label: "Cost Savings", value: "-50%", color: "text-purple-600" },
        { icon: TrendingUp, label: "Resolution Rate", value: "+90%", color: "text-orange-600" },
      ],
      tags: ["AI Integration", "Customer Service", "Automation"],
    },
    {
      id: "3",
      title: "SEO Campaign Success",
      client: "Local Business",
      description: "Comprehensive SEO strategy implementation that drove organic traffic and improved local search rankings.",
      coverImage: null,
      results: [
        { icon: TrendingUp, label: "Organic Traffic", value: "+200%", color: "text-green-600" },
        { icon: Users, label: "Leads", value: "+150%", color: "text-blue-600" },
        { icon: DollarSign, label: "ROI", value: "+180%", color: "text-purple-600" },
        { icon: Clock, label: "Ranking Time", value: "3 months", color: "text-orange-600" },
      ],
      tags: ["SEO", "Content Marketing", "Local SEO"],
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
                Case Studies
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Real results from real projects
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="space-y-12">
              {caseStudies.map((study) => (
                <Card key={study.id} className="hover-elevate overflow-hidden" data-testid={`card-study-${study.id}`}>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="aspect-video md:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {study.coverImage ? (
                          <img
                            src={study.coverImage}
                            alt={study.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-6xl">📊</div>
                        )}
                      </div>

                      <div className="p-8">
                        <div className="mb-4">
                          <Badge variant="outline" className="mb-2">{study.client}</Badge>
                          <h2 className="text-2xl font-bold" data-testid={`text-title-${study.id}`}>
                            {study.title}
                          </h2>
                        </div>

                        <p className="mb-6 text-muted-foreground" data-testid={`text-description-${study.id}`}>
                          {study.description}
                        </p>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                          {study.results.map((result, idx) => {
                            const Icon = result.icon;
                            return (
                              <div key={idx} className="rounded-lg bg-muted/50 p-4">
                                <Icon className={`mb-2 h-5 w-5 ${result.color}`} />
                                <div className={`text-2xl font-bold ${result.color}`}>
                                  {result.value}
                                </div>
                                <div className="text-xs text-muted-foreground">{result.label}</div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {study.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
