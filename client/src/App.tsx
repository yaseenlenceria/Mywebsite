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
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-2 border-b px-6 py-3">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
