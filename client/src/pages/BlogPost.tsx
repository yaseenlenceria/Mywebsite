import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost as BlogPostType } from "@shared/schema";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPostType>({
    queryKey: ["/api/public/blog-posts", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-6 py-20">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted mb-6" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted mb-12" />
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-3 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-6 py-20 text-center">
            <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
            <p className="mb-8 text-muted-foreground">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/blog">
                <a>Back to Blog</a>
              </Link>
            </Button>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <article className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <Link href="/blog">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 hover-elevate rounded-md px-3 py-2" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </a>
            </Link>

            {post.coverImage && (
              <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags && post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="mb-4 text-4xl font-bold sm:text-5xl" data-testid="text-title">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  5 min read
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none" data-testid="content-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
