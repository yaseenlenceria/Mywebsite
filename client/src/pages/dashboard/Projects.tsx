import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Client, InsertProject } from "@shared/schema";
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
import { insertProjectSchema } from "@shared/schema";
import { Plus, Folder, Calendar } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Projects() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      userId: "",
      title: "",
      description: "",
      status: "pending",
      showOnPortfolio: false,
      coverImage: "",
      documents: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      await apiRequest("POST", "/api/projects", { ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project created successfully" });
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

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProject & { id: string }) => {
      await apiRequest("PUT", `/api/projects/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project updated successfully" });
      setDialogOpen(false);
      setEditingProject(null);
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

  const onSubmit = (data: InsertProject) => {
    if (editingProject) {
      updateMutation.mutate({ ...data, id: editingProject.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      userId: project.userId,
      clientId: project.clientId || undefined,
      title: project.title,
      description: project.description || "",
      status: project.status,
      startDate: project.startDate || undefined,
      endDate: project.endDate || undefined,
      deadline: project.deadline || undefined,
      showOnPortfolio: project.showOnPortfolio,
      coverImage: project.coverImage || "",
      documents: project.documents || [],
    });
    setDialogOpen(true);
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleUploadComplete = (result: any) => {
    if (result.successful && result.successful[0]) {
      const uploadURL = result.successful[0].uploadURL;
      form.setValue("coverImage", uploadURL);
      toast({ title: "Success", description: "Image uploaded successfully" });
    }
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Projects</h1>
          <p className="text-lg text-muted-foreground">Manage your client projects and deliverables</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="default" data-testid="button-new-project" onClick={() => { setEditingProject(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
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
                        <Input placeholder="Project title" {...field} data-testid="input-title" />
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
                        <Textarea placeholder="Project description" {...field} data-testid="input-description" />
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
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="show-portfolio"
                    checked={form.watch("showOnPortfolio")}
                    onCheckedChange={(checked) => form.setValue("showOnPortfolio", checked)}
                    data-testid="switch-show-portfolio"
                  />
                  <Label htmlFor="show-portfolio">Show on public portfolio</Label>
                </div>

                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2">
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="w-full"
                    >
                      <span>Upload Cover Image</span>
                    </ObjectUploader>
                    {form.watch("coverImage") && (
                      <p className="mt-2 text-xs text-muted-foreground">Image uploaded</p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const clientName = clients?.find(c => c.id === project.clientId)?.name;
            return (
              <Card 
                key={project.id} 
                className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all" 
                onClick={() => handleEdit(project)} 
                data-testid={`card-project-${project.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold line-clamp-1 mb-1">
                          {project.title}
                        </CardTitle>
                        {clientName && (
                          <p className="text-xs text-muted-foreground">
                            {clientName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[project.status as keyof typeof statusColors]} shrink-0`}
                    >
                      {project.status === "in_progress" ? "In Progress" : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {project.description || "No description provided"}
                  </p>
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                  {project.showOnPortfolio && (
                    <Badge variant="secondary" className="text-xs">
                      Portfolio
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Folder className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Start organizing your work by creating your first project
            </p>
            <Button onClick={() => setDialogOpen(true)} size="default">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
