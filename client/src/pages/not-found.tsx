import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-9xl font-bold text-muted-foreground">404</div>
        <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild data-testid="button-home">
            <Link href="/">
              <a className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </a>
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
