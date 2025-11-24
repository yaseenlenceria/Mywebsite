import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  users,
  clients,
  projects,
  invoices,
  invoiceItems,
  expenses,
  income,
  tasks,
  blogPosts,
  testimonials,
  type User,
  type UpsertUser,
  type Client,
  type InsertClient,
  type Project,
  type InsertProject,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem,
  type Expense,
  type InsertExpense,
  type Income,
  type InsertIncome,
  type Task,
  type InsertTask,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Clients
  getClients(userId: string): Promise<Client[]>;
  getClient(id: string, userId: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, userId: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string, userId: string): Promise<void>;

  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getPortfolioProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, userId: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<void>;

  // Invoices
  getInvoices(userId: string): Promise<Invoice[]>;
  getInvoice(id: string, userId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, userId: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string, userId: string): Promise<void>;

  // Invoice Items
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  deleteInvoiceItem(id: string): Promise<void>;

  // Expenses
  getExpenses(userId: string): Promise<Expense[]>;
  getExpense(id: string, userId: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, userId: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string, userId: string): Promise<void>;

  // Income
  getIncome(userId: string): Promise<Income[]>;
  getIncomeItem(id: string, userId: string): Promise<Income | undefined>;
  createIncome(income: InsertIncome): Promise<Income>;
  updateIncome(id: string, userId: string, income: Partial<InsertIncome>): Promise<Income | undefined>;
  deleteIncome(id: string, userId: string): Promise<void>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<void>;

  // Blog Posts
  getBlogPosts(userId?: string, publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string, userId: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, userId: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string, userId: string): Promise<void>;

  // Testimonials
  getTestimonials(userId?: string, featuredOnly?: boolean): Promise<Testimonial[]>;
  getTestimonial(id: string, userId: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, userId: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ========== USERS ==========
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // ========== CLIENTS ==========
  async getClients(userId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string, userId: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(and(eq(clients.userId, userId), eq(clients.id, id))).limit(1);
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: string, userId: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(and(eq(clients.userId, userId), eq(clients.id, id)))
      .returning();
    return result[0];
  }

  async deleteClient(id: string, userId: string): Promise<void> {
    await db.delete(clients).where(and(eq(clients.userId, userId), eq(clients.id, id)));
  }

  // ========== PROJECTS ==========
  async getProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async getPortfolioProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.showOnPortfolio, true)))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string, userId: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(and(eq(projects.userId, userId), eq(projects.id, id))).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, userId: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(and(eq(projects.userId, userId), eq(projects.id, id)))
      .returning();
    return result[0];
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    await db.delete(projects).where(and(eq(projects.userId, userId), eq(projects.id, id)));
  }

  // ========== INVOICES ==========
  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: string, userId: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(and(eq(invoices.userId, userId), eq(invoices.id, id))).limit(1);
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoice(id: string, userId: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const result = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(and(eq(invoices.userId, userId), eq(invoices.id, id)))
      .returning();
    return result[0];
  }

  async deleteInvoice(id: string, userId: string): Promise<void> {
    await db.delete(invoices).where(and(eq(invoices.userId, userId), eq(invoices.id, id)));
  }

  // ========== INVOICE ITEMS ==========
  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const result = await db.insert(invoiceItems).values(item).returning();
    return result[0];
  }

  async deleteInvoiceItem(id: string): Promise<void> {
    await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
  }

  // ========== EXPENSES ==========
  async getExpenses(userId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.date));
  }

  async getExpense(id: string, userId: string): Promise<Expense | undefined> {
    const result = await db.select().from(expenses).where(and(eq(expenses.userId, userId), eq(expenses.id, id))).limit(1);
    return result[0];
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const result = await db.insert(expenses).values(expense).returning();
    return result[0];
  }

  async updateExpense(id: string, userId: string, expense: Partial<InsertExpense>): Promise<Expense | undefined> {
    const result = await db
      .update(expenses)
      .set({ ...expense, updatedAt: new Date() })
      .where(and(eq(expenses.userId, userId), eq(expenses.id, id)))
      .returning();
    return result[0];
  }

  async deleteExpense(id: string, userId: string): Promise<void> {
    await db.delete(expenses).where(and(eq(expenses.userId, userId), eq(expenses.id, id)));
  }

  // ========== INCOME ==========
  async getIncome(userId: string): Promise<Income[]> {
    return await db.select().from(income).where(eq(income.userId, userId)).orderBy(desc(income.date));
  }

  async getIncomeItem(id: string, userId: string): Promise<Income | undefined> {
    const result = await db.select().from(income).where(and(eq(income.userId, userId), eq(income.id, id))).limit(1);
    return result[0];
  }

  async createIncome(incomeItem: InsertIncome): Promise<Income> {
    const result = await db.insert(income).values(incomeItem).returning();
    return result[0];
  }

  async updateIncome(id: string, userId: string, incomeItem: Partial<InsertIncome>): Promise<Income | undefined> {
    const result = await db
      .update(income)
      .set({ ...incomeItem, updatedAt: new Date() })
      .where(and(eq(income.userId, userId), eq(income.id, id)))
      .returning();
    return result[0];
  }

  async deleteIncome(id: string, userId: string): Promise<void> {
    await db.delete(income).where(and(eq(income.userId, userId), eq(income.id, id)));
  }

  // ========== TASKS ==========
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.id, id))).limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(and(eq(tasks.userId, userId), eq(tasks.id, id)))
      .returning();
    return result[0];
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    await db.delete(tasks).where(and(eq(tasks.userId, userId), eq(tasks.id, id)));
  }

  // ========== BLOG POSTS ==========
  async getBlogPosts(userId?: string, publishedOnly: boolean = false): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);

    if (userId && publishedOnly) {
      query = query.where(and(eq(blogPosts.userId, userId), eq(blogPosts.published, true)));
    } else if (userId) {
      query = query.where(eq(blogPosts.userId, userId));
    } else if (publishedOnly) {
      query = query.where(eq(blogPosts.published, true));
    }

    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string, userId: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(and(eq(blogPosts.userId, userId), eq(blogPosts.id, id))).limit(1);
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: string, userId: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(and(eq(blogPosts.userId, userId), eq(blogPosts.id, id)))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: string, userId: string): Promise<void> {
    await db.delete(blogPosts).where(and(eq(blogPosts.userId, userId), eq(blogPosts.id, id)));
  }

  // ========== TESTIMONIALS ==========
  async getTestimonials(userId?: string, featuredOnly: boolean = false): Promise<Testimonial[]> {
    let query = db.select().from(testimonials);

    if (userId && featuredOnly) {
      query = query.where(and(eq(testimonials.userId, userId), eq(testimonials.featured, true)));
    } else if (userId) {
      query = query.where(eq(testimonials.userId, userId));
    } else if (featuredOnly) {
      query = query.where(eq(testimonials.featured, true));
    }

    return await query.orderBy(desc(testimonials.createdAt));
  }

  async getTestimonial(id: string, userId: string): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(and(eq(testimonials.userId, userId), eq(testimonials.id, id))).limit(1);
    return result[0];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  async updateTestimonial(id: string, userId: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const result = await db
      .update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(and(eq(testimonials.userId, userId), eq(testimonials.id, id)))
      .returning();
    return result[0];
  }

  async deleteTestimonial(id: string, userId: string): Promise<void> {
    await db.delete(testimonials).where(and(eq(testimonials.userId, userId), eq(testimonials.id, id)));
  }
}

export const storage = new DatabaseStorage();
