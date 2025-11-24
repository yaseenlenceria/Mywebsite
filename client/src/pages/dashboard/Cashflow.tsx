import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Briefcase, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Cashflow() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: cashflowData } = useQuery({
    queryKey: ["/api/dashboard/cashflow"],
  });

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const netProfit = (stats?.totalIncome || 0) - (stats?.totalExpenses || 0);
  const profitMargin = stats?.totalIncome ? ((netProfit / stats.totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Financial Overview</h1>
        <p className="text-muted-foreground text-lg">Track your income, expenses, and profitability at a glance</p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Income Card */}
          <Card className="relative overflow-visible hover-elevate">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-md" />
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold tracking-tight" data-testid="text-total-income">
                ${stats?.totalIncome?.toLocaleString() || "0"}
              </div>
              <p className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                This month
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses Card */}
          <Card className="relative overflow-visible hover-elevate">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-md" />
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold tracking-tight" data-testid="text-total-expenses">
                ${stats?.totalExpenses?.toLocaleString() || "0"}
              </div>
              <p className="flex items-center text-xs text-muted-foreground">
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                This month
              </p>
            </CardContent>
          </Card>

          {/* Net Profit Card */}
          <Card className="relative overflow-visible hover-elevate">
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${netProfit >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`} />
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${netProfit >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                <TrendingUp className={`h-5 w-5 ${netProfit >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-orange-600 dark:text-orange-500'}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold tracking-tight" data-testid="text-net-profit">
                ${netProfit.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={netProfit >= 0 ? "default" : "secondary"} className="text-xs">
                  {profitMargin}% margin
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Active Projects Card */}
          <Card className="relative overflow-visible hover-elevate">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-md" />
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold tracking-tight" data-testid="text-active-projects">
                {stats?.activeProjects || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Analytics Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Financial Analytics</h2>
          <p className="text-sm text-muted-foreground">Monthly breakdown of income and expenses</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="hover-elevate">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
              <CardDescription>Compare monthly revenue and costs</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={cashflowData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg font-semibold">Net Profit Trend</CardTitle>
              <CardDescription>Track profitability over time</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={cashflowData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Profit"
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
