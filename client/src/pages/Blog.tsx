import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { Clock, Calendar } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/public/blog-posts"],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl" data-testid="text-page-title">
                Blog
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Insights on web development, SEO, and digital innovation
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
            ) : posts && posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <a>
                      <Card className="h-full hover-elevate" data-testid={`card-post-${post.id}`}>
                        <CardContent className="p-0">
                          <div className="aspect-video w-full overflow-hidden bg-muted">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-4xl">
                                📝
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <div className="mb-3 flex flex-wrap gap-2">
                              {post.tags && post.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold line-clamp-2" data-testid={`text-title-${post.id}`}>
                              {post.title}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground line-clamp-2" data-testid={`text-excerpt-${post.id}`}>
                              {post.excerpt || "Read more..."}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt!).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                5 min read
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No Blog Posts Yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for insights and articles
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
