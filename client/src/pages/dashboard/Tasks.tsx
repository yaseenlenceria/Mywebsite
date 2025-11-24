import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, Project, InsertTask } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { Plus, CheckSquare, Calendar } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Tasks() {
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

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      userId: "",
      title: "",
      description: "",
      status: "pending",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      await apiRequest("POST", "/api/tasks", { ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Success", description: "Task created successfully" });
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/tasks/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Success", description: "Task status updated" });
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

  const onSubmit = (data: InsertTask) => {
    createMutation.mutate(data);
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Tasks</h1>
          <p className="text-muted-foreground">Manage your to-do list and project tasks</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-task">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task title" {...field} data-testid="input-title" />
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
                        <Textarea placeholder="Task description" {...field} value={field.value || ""} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No project</SelectItem>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          data-testid="input-due-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover-elevate" data-testid={`card-task-${task.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold" data-testid={`text-title-${task.id}`}>
                        {task.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={statusColors[task.status as keyof typeof statusColors]}
                        onClick={() => {
                          const newStatus = task.status === "completed" ? "pending" : task.status === "pending" ? "in_progress" : "completed";
                          updateStatusMutation.mutate({ id: task.id, status: newStatus });
                        }}
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first task to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
