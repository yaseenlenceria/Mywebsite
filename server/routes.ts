import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import {
  insertClientPayloadSchema,
  insertProjectPayloadSchema,
  insertInvoicePayloadSchema,
  insertInvoiceItemPayloadSchema,
  insertExpensePayloadSchema,
  insertIncomePayloadSchema,
  insertTaskPayloadSchema,
  insertBlogPostPayloadSchema,
  insertTestimonialPayloadSchema,
  updateClientSchema,
  updateProjectSchema,
  updateInvoiceSchema,
  updateExpenseSchema,
  updateIncomeSchema,
  updateTaskSchema,
  updateBlogPostSchema,
  updateTestimonialSchema,
} from "@shared/schema";
import { z } from "zod";
import jsPDF from "jspdf";
import "jspdf-autotable";
import OpenAI from "openai";

// Update schemas now imported from @shared/schema - they use .strict() to reject unknown keys
// and whitelist only mutable fields, preventing injection of system fields or nested relations

// Reference: javascript_openai_ai_integrations blueprint
// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // ========== AUTH ROUTES ==========
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ========== PUBLIC ROUTES (for website) ==========
  // Public assets serving
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public portfolio projects (for portfolio page)
  app.get('/api/public/projects', async (req, res) => {
    try {
      // Get the first user (freelancer/business owner)
      // In a real app, you might have a specific user ID for the site owner
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const projects = await storage.getPortfolioProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects:", error);
      res.status(500).json({ message: "Failed to fetch portfolio projects" });
    }
  });

  // Public blog posts (for blog page)
  app.get('/api/public/blog', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const posts = await storage.getBlogPosts(userId, true); // published only
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Public blog post by slug
  app.get('/api/public/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Public testimonials (for website)
  app.get('/api/public/testimonials', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const testimonials = await storage.getTestimonials(userId, true); // featured only
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // ========== PROTECTED OBJECT STORAGE ROUTES ==========
  // Protected file serving with ACL check
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Update object ACL after upload
  app.put("/api/objects/acl", isAuthenticated, async (req: any, res) => {
    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    const userId = req.user?.claims?.sub;
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: userId,
          visibility: "private",
        },
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting object ACL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ========== CLIENTS CRUD ==========
  app.get('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getClients(userId);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertClientPayloadSchema.parse(req.body);
      const client = await storage.createClient({ ...validatedData, userId });
      res.json(client);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.patch('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateClientSchema.parse(req.body);
      const client = await storage.updateClient(req.params.id, userId, validatedData);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating client:", error);
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteClient(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // ========== PROJECTS CRUD ==========
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertProjectPayloadSchema.parse(req.body);
      const project = await storage.createProject({ ...validatedData, userId });
      res.json(project);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, userId, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteProject(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // ========== INVOICES CRUD ==========
  app.get('/api/invoices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoices = await storage.getInvoices(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get('/api/invoices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoice = await storage.getInvoice(req.params.id, userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const items = await storage.getInvoiceItems(req.params.id);
      res.json({ ...invoice, items });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.post('/api/invoices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, ...invoiceData } = req.body;
      
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedInvoice = insertInvoicePayloadSchema.parse(invoiceData);
      const invoice = await storage.createInvoice({ ...validatedInvoice, userId });

      // Create invoice items - parse with payload schema (omits invoiceId), then inject
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const validatedItem = insertInvoiceItemPayloadSchema.parse(item);
          await storage.createInvoiceItem({ ...validatedItem, invoiceId: invoice.id });
        }
      }

      res.json(invoice);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.patch('/api/invoices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateInvoiceSchema.parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, userId, validatedData);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  app.delete('/api/invoices/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteInvoice(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Generate PDF for invoice
  app.get('/api/invoices/:id/pdf', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoice = await storage.getInvoice(req.params.id, userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const items = await storage.getInvoiceItems(req.params.id);

      // Create PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('INVOICE', 20, 20);
      
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 35);
      doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, 42);
      doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 49);
      doc.text(`Status: ${invoice.status}`, 20, 56);

      // Client info
      doc.text('Bill To:', 120, 35);
      doc.text(invoice.clientName || '', 120, 42);
      if (invoice.clientEmail) doc.text(invoice.clientEmail, 120, 49);

      // Items table
      const tableData = items.map(item => [
        item.description,
        item.quantity.toString(),
        `$${item.rate.toFixed(2)}`,
        `$${(item.quantity * item.rate).toFixed(2)}`
      ]);

      (doc as any).autoTable({
        startY: 70,
        head: [['Description', 'Qty', 'Rate', 'Amount']],
        body: tableData,
      });

      // Total
      const finalY = (doc as any).lastAutoTable.finalY || 70;
      doc.setFontSize(12);
      doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, finalY + 15);

      // Notes
      if (invoice.notes) {
        doc.setFontSize(10);
        doc.text('Notes:', 20, finalY + 30);
        doc.text(invoice.notes, 20, finalY + 37, { maxWidth: 170 });
      }

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // ========== EXPENSES CRUD ==========
  app.get('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const expenses = await storage.getExpenses(userId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertExpensePayloadSchema.parse(req.body);
      const expense = await storage.createExpense({ ...validatedData, userId });
      res.json(expense);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.patch('/api/expenses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateExpenseSchema.parse(req.body);
      const expense = await storage.updateExpense(req.params.id, userId, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  app.delete('/api/expenses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteExpense(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // ========== INCOME CRUD ==========
  app.get('/api/income', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const incomeData = await storage.getIncome(userId);
      res.json(incomeData);
    } catch (error) {
      console.error("Error fetching income:", error);
      res.status(500).json({ message: "Failed to fetch income" });
    }
  });

  app.post('/api/income', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertIncomePayloadSchema.parse(req.body);
      const incomeItem = await storage.createIncome({ ...validatedData, userId });
      res.json(incomeItem);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating income:", error);
      res.status(500).json({ message: "Failed to create income" });
    }
  });

  app.patch('/api/income/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateIncomeSchema.parse(req.body);
      const incomeItem = await storage.updateIncome(req.params.id, userId, validatedData);
      if (!incomeItem) {
        return res.status(404).json({ message: "Income not found" });
      }
      res.json(incomeItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating income:", error);
      res.status(500).json({ message: "Failed to update income" });
    }
  });

  app.delete('/api/income/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteIncome(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting income:", error);
      res.status(500).json({ message: "Failed to delete income" });
    }
  });

  // ========== TASKS CRUD ==========
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertTaskPayloadSchema.parse(req.body);
      const task = await storage.createTask({ ...validatedData, userId });
      res.json(task);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, userId, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTask(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // ========== BLOG POSTS CRUD ==========
  app.get('/api/blog', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getBlogPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/blog', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertBlogPostPayloadSchema.parse(req.body);
      const post = await storage.createBlogPost({ ...validatedData, userId });
      res.json(post);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.patch('/api/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, userId, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteBlogPost(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // ========== TESTIMONIALS CRUD ==========
  app.get('/api/testimonials', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const testimonials = await storage.getTestimonials(userId);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post('/api/testimonials', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Parse request body with payload schema (omits userId), then inject server-side
      const validatedData = insertTestimonialPayloadSchema.parse(req.body);
      const testimonial = await storage.createTestimonial({ ...validatedData, userId });
      res.json(testimonial);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.patch('/api/testimonials/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, userId, validatedData);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete('/api/testimonials/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTestimonial(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // ========== AI ASSISTANT ENDPOINT ==========
  app.post('/api/ai/assistant', isAuthenticated, async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build context-aware system message
      let systemMessage = `You are a helpful AI assistant for a freelancer/business owner. 
You help with tasks like generating project proposals, analyzing cashflow, writing invoices, 
suggesting SEO-optimized blog titles, creating summaries, and providing business insights.`;

      if (context) {
        systemMessage += `\n\nContext: ${JSON.stringify(context)}`;
      }

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        max_completion_tokens: 8192,
      });

      const assistantMessage = response.choices[0]?.message?.content || "";
      res.json({ message: assistantMessage });
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
