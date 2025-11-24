import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Income, Client, InsertIncome } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema } from "@shared/schema";
import { Plus, DollarSign, TrendingUp } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function Income() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: income, isLoading } = useQuery<Income[]>({
    queryKey: ["/api/income"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const form = useForm<InsertIncome>({
    resolver: zodResolver(insertIncomeSchema),
    defaultValues: {
      userId: "",
      amount: "0",
      description: "",
      date: new Date(),
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertIncome) => {
      await apiRequest("POST", "/api/income", { ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/income"] });
      toast({ title: "Success", description: "Income recorded successfully" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertIncome) => {
    createMutation.mutate(data);
  };

  const totalIncome = income?.reduce((sum, i) => sum + parseFloat(i.amount), 0) || 0;

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#8884d8", "#82ca9d", "#ffc658"];

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Income</h1>
          <p className="text-muted-foreground">Track and manage your income sources</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-income">
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Income</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} data-testid="input-amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Income description" {...field} value={field.value || ""} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client (Optional)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client">
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No client</SelectItem>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending ? "Recording..." : "Record Income"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold" data-testid="text-total-income">
            ${totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted mb-2" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : income && income.length > 0 ? (
        <div className="space-y-4">
          {income.map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`card-income-${item.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">${item.amount}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No income recorded yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start tracking your income</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
