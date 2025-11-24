import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, TrendingUp, Sparkles, Award, Users, Zap } from "lucide-react";

export default function About() {
  const skills = [
    "JavaScript / TypeScript",
    "React / Next.js",
    "Node.js / Express",
    "Shopify Development",
    "SEO Optimization",
    "AI/ML Integration",
    "Database Design",
    "API Development",
  ];

  const achievements = [
    { icon: Users, label: "50+ Clients", description: "Satisfied clients worldwide" },
    { icon: Code, label: "100+ Projects", description: "Successfully delivered" },
    { icon: Award, label: "5+ Years", description: "Industry experience" },
    { icon: Zap, label: "99% Success", description: "Project success rate" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                About Me
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Passionate developer and SEO specialist helping businesses succeed online
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-8xl">👨‍💻</div>
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold">Hi, I'm Your Freelance Partner</h2>
                <p className="mb-4 text-muted-foreground">
                  With over 5 years of experience in web development and digital marketing, I specialize in creating high-performance Shopify stores, implementing cutting-edge SEO strategies, and building AI-powered web applications.
                </p>
                <p className="mb-4 text-muted-foreground">
                  My approach combines technical expertise with business acumen to deliver solutions that not only look great but also drive real results for your business.
                </p>
                <p className="text-muted-foreground">
                  I believe in continuous learning and staying ahead of industry trends to provide the best possible service to my clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Key Achievements</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card key={index} className="hover-elevate">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="mb-2 text-2xl font-bold">{achievement.label}</div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Skills & Expertise</h2>
              <p className="text-lg text-muted-foreground">Technologies and services I work with</p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">Development</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Full-Stack JavaScript</li>
                      <li>React & Next.js</li>
                      <li>Node.js & Express</li>
                      <li>Database Design</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">SEO & Marketing</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Technical SEO</li>
                      <li>Content Optimization</li>
                      <li>Link Building</li>
                      <li>Analytics & Reporting</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">Specializations</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Shopify Development</li>
                      <li>AI Integration</li>
                      <li>E-commerce Solutions</li>
                      <li>Performance Optimization</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
