// Dashboard sidebar component - Reference: shadcn sidebar from design_guidelines.md
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  DollarSign,
  TrendingDown,
  BarChart3,
  Users,
  CheckSquare,
  Sparkles,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Cashflow",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Income",
    url: "/dashboard/income",
    icon: DollarSign,
  },
  {
    title: "Expenses",
    url: "/dashboard/expenses",
    icon: TrendingDown,
  },
  {
    title: "Clients",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "AI Assistant",
    url: "/dashboard/ai-assistant",
    icon: Sparkles,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border/80 bg-sidebar/75 backdrop-blur-xl">
      <SidebarHeader className="border-b border-sidebar-border px-5 py-6">
        <Link href="/dashboard">
          <a className="group flex items-center gap-3" data-testid="link-sidebar-home">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:-translate-y-0.5">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Freelancer OS</span>
              <span className="text-xs text-sidebar-foreground/70">Modern freelancer control room</span>
            </div>
          </a>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col gap-4 px-3 py-4">
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel className="px-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/70">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="group relative rounded-lg px-3 py-2 text-sm font-medium transition data-[active=true]:bg-primary/15 data-[active=true]:text-sidebar-foreground hover:bg-sidebar-accent/60"
                  >
                    <Link href={item.url}>
                      <a
                        aria-current={location === item.url ? "page" : undefined}
                        className="flex items-center gap-3"
                        data-testid={`link-sidebar-${item.title.toLowerCase().replace(" ", "-")}`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate text-left">{item.title}</span>
                        <span
                          aria-hidden
                          className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-primary opacity-0 transition-opacity data-[active=true]:opacity-100"
                          data-active={location === item.url}
                        />
                      </a>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-3" />
        <SidebarFooter className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
          <div className="rounded-lg bg-sidebar-accent/70 px-3 py-2 text-xs leading-relaxed text-sidebar-foreground/70 ring-1 ring-sidebar-border">
            <p className="font-semibold text-sidebar-foreground">Stay organized</p>
            <p>Track cashflow, projects, and AI support without losing focus.</p>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-lg px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <a href="/api/logout" data-testid="link-sidebar-logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
