import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { ExternalLink } from "lucide-react";

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/public/portfolio"],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Portfolio
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                A showcase of my best work and successful projects
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-6">
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="hover-elevate">
                    <CardContent className="p-0">
                      <div className="aspect-video w-full animate-pulse rounded-t-md bg-muted" />
                      <div className="p-6">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-3" />
                        <div className="h-3 w-full animate-pulse rounded bg-muted mb-2" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="group hover-elevate overflow-hidden" data-testid={`card-project-${project.id}`}>
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {project.coverImage ? (
                          <>
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                              <Badge variant="secondary" className="gap-1">
                                <ExternalLink className="h-3 w-3" />
                                View
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl">
                            📁
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-semibold" data-testid={`text-title-${project.id}`}>
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${project.id}`}>
                          {project.description || "No description available"}
                        </p>
                        {project.endDate && (
                          <div className="mt-4">
                            <Badge variant="outline" className="text-xs">
                              Completed {new Date(project.endDate).getFullYear()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ExternalLink className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No Projects Yet</h3>
                <p className="text-muted-foreground">
                  Portfolio projects will be displayed here once added
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
