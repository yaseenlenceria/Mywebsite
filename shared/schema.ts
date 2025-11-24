// Complete database schema for Freelancer SaaS Platform
// References: javascript_database, javascript_log_in_with_replit blueprints
import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========== AUTH TABLES (Required for Replit Auth) ==========

// Session storage table (Required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (Required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ========== CLIENTS TABLE ==========

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertClientPayloadSchema = insertClientSchema.omit({ userId: true }).strip();

export const updateClientSchema = insertClientSchema.pick({
  name: true,
  email: true,
  phone: true,
  website: true,
  whatsapp: true,
  notes: true,
}).partial().strict();

export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertClientPayload = z.infer<typeof insertClientPayloadSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
export type Client = typeof clients.$inferSelect;

// ========== PROJECTS TABLE ==========

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: 'set null' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, in_progress, completed
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  deadline: timestamp("deadline"),
  showOnPortfolio: boolean("show_on_portfolio").default(false),
  coverImage: text("cover_image"),
  documents: text("documents").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertProjectPayloadSchema = insertProjectSchema.omit({ userId: true }).strip();

export const updateProjectSchema = insertProjectSchema.pick({
  clientId: true,
  title: true,
  description: true,
  status: true,
  startDate: true,
  endDate: true,
  deadline: true,
  coverImage: true,
  documents: true,
  // showOnPortfolio is EXCLUDED - system-managed flag
}).partial().strict();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProjectPayload = z.infer<typeof insertProjectPayloadSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;

// ========== INVOICES TABLE ==========

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: 'cascade' }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'set null' }),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, paid, overdue
  pdfUrl: text("pdf_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertInvoicePayloadSchema = insertInvoiceSchema.omit({ userId: true }).strip();

export const updateInvoiceSchema = insertInvoiceSchema.pick({
  clientId: true,
  projectId: true,
  dueDate: true,
  status: true,
  notes: true,
  // invoiceNumber is EXCLUDED - immutable once issued
  // amount is EXCLUDED - computed from invoice items
  // pdfUrl is EXCLUDED - system-generated
}).partial().strict();

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertInvoicePayload = z.infer<typeof insertInvoicePayloadSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// ========== INVOICE ITEMS TABLE ==========

export const invoiceItems = pgTable("invoice_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
  id: true,
  createdAt: true,
});

// Request payload schema - omits invoiceId (injected server-side)
export const insertInvoiceItemPayloadSchema = insertInvoiceItemSchema.omit({ invoiceId: true }).strip();

export const updateInvoiceItemSchema = insertInvoiceItemSchema.pick({
  description: true,
  quantity: true,
  rate: true,
  total: true,
}).partial().strict();

export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type InsertInvoiceItemPayload = z.infer<typeof insertInvoiceItemPayloadSchema>;
export type UpdateInvoiceItem = z.infer<typeof updateInvoiceItemSchema>;
export type InvoiceItem = typeof invoiceItems.$inferSelect;

// ========== EXPENSES TABLE ==========

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: varchar("category", { length: 100 }).notNull(), // tools, services, travel, hosting, etc
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertExpensePayloadSchema = insertExpenseSchema.omit({ userId: true }).strip();

export const updateExpenseSchema = insertExpenseSchema.pick({
  category: true,
  amount: true,
  description: true,
  date: true,
}).partial().strict();

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertExpensePayload = z.infer<typeof insertExpensePayloadSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// ========== INCOME TABLE ==========

export const income = pgTable("income", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: 'set null' }),
  invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: 'set null' }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIncomeSchema = createInsertSchema(income).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertIncomePayloadSchema = insertIncomeSchema.omit({ userId: true }).strip();

export const updateIncomeSchema = insertIncomeSchema.pick({
  clientId: true,
  invoiceId: true,
  amount: true,
  description: true,
  date: true,
}).partial().strict();

export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type InsertIncomePayload = z.infer<typeof insertIncomePayloadSchema>;
export type UpdateIncome = z.infer<typeof updateIncomeSchema>;
export type Income = typeof income.$inferSelect;

// ========== TASKS TABLE ==========

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'set null' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertTaskPayloadSchema = insertTaskSchema.omit({ userId: true }).strip();

export const updateTaskSchema = insertTaskSchema.pick({
  projectId: true,
  title: true,
  description: true,
  status: true,
  dueDate: true,
}).partial().strict();

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertTaskPayload = z.infer<typeof insertTaskPayloadSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// ========== BLOG POSTS TABLE ==========

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  published: boolean("published").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertBlogPostPayloadSchema = insertBlogPostSchema.omit({ userId: true }).strip();

export const updateBlogPostSchema = insertBlogPostSchema.pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  coverImage: true,
  published: true,
  tags: true,
}).partial().strict();

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertBlogPostPayload = z.infer<typeof insertBlogPostPayloadSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// ========== TESTIMONIALS TABLE ==========

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientCompany: varchar("client_company", { length: 255 }),
  clientPhoto: text("client_photo"),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Request payload schema - omits userId (injected server-side)
export const insertTestimonialPayloadSchema = insertTestimonialSchema.omit({ userId: true }).strip();

export const updateTestimonialSchema = insertTestimonialSchema.pick({
  clientName: true,
  clientCompany: true,
  clientPhoto: true,
  quote: true,
  rating: true,
  featured: true,
}).partial().strict();

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertTestimonialPayload = z.infer<typeof insertTestimonialPayloadSchema>;
export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// ========== RELATIONS (Declared at end to avoid forward reference errors) ==========

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  projects: many(projects),
  invoices: many(invoices),
  income: many(income),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  invoices: many(invoices),
  tasks: many(tasks),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export const incomeRelations = relations(income, ({ one }) => ({
  user: one(users, {
    fields: [income.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [income.clientId],
    references: [clients.id],
  }),
  invoice: one(invoices, {
    fields: [income.invoiceId],
    references: [invoices.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  user: one(users, {
    fields: [blogPosts.userId],
    references: [users.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));
