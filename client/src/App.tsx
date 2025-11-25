import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import CaseStudies from "@/pages/CaseStudies";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Testimonials from "@/pages/Testimonials";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

import Cashflow from "@/pages/dashboard/Cashflow";
import Projects from "@/pages/dashboard/Projects";
import Invoices from "@/pages/dashboard/Invoices";
import Income from "@/pages/dashboard/Income";
import Expenses from "@/pages/dashboard/Expenses";
import Clients from "@/pages/dashboard/Clients";
import Tasks from "@/pages/dashboard/Tasks";
import AIAssistant from "@/pages/dashboard/AIAssistant";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.1),transparent_35%)]"
        />
        <AppSidebar />
        <div className="relative z-10 flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-card/85 px-6 py-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="h-8 w-px bg-border" aria-hidden />
              <span className="text-sm font-medium text-muted-foreground">Freelancer OS</span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10 lg:py-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if trying to access dashboard without authentication
  if (!isLoading && !isAuthenticated && window.location.pathname.startsWith('/dashboard')) {
    window.location.href = '/api/login';
    return null;
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
        </>
      ) : (
        <>
          <Route path="/">
            {() => <DashboardLayout><Cashflow /></DashboardLayout>}
          </Route>
          <Route path="/dashboard">
            {() => <DashboardLayout><Cashflow /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/projects">
            {() => <DashboardLayout><Projects /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/invoices">
            {() => <DashboardLayout><Invoices /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/income">
            {() => <DashboardLayout><Income /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/expenses">
            {() => <DashboardLayout><Expenses /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/clients">
            {() => <DashboardLayout><Clients /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/tasks">
            {() => <DashboardLayout><Tasks /></DashboardLayout>}
          </Route>
          <Route path="/dashboard/ai-assistant">
            {() => <DashboardLayout><AIAssistant /></DashboardLayout>}
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
