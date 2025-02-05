import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workflowTemplates = pgTable("workflow_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  yaml: text("yaml").notNull(),
  category: text("category").notNull(),
});

export const workflowConfigs = pgTable("workflow_configs", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => workflowTemplates.id),
  repoOwner: text("repo_owner").notNull(),
  repoName: text("repo_name").notNull(),
  yaml: text("yaml").notNull(),
});

export const insertTemplateSchema = createInsertSchema(workflowTemplates);
export const insertConfigSchema = createInsertSchema(workflowConfigs);

export type Template = typeof workflowTemplates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Config = typeof workflowConfigs.$inferSelect;
export type InsertConfig = z.infer<typeof insertConfigSchema>;
