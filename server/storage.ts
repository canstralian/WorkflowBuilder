import { type Template, type InsertTemplate, type Config, type InsertConfig, workflowTemplates, workflowConfigs } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getConfigsByRepo(owner: string, repo: string): Promise<Config[]>;
  createConfig(config: InsertConfig): Promise<Config>;
}

export class DatabaseStorage implements IStorage {
  async getTemplates(): Promise<Template[]> {
    try {
      const templates = await db.select().from(workflowTemplates);
      return templates;
    } catch (error) {
      console.error("Database error in getTemplates:", error);
      throw new Error("Database operation failed");
    }
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    try {
      const [template] = await db
        .select()
        .from(workflowTemplates)
        .where(eq(workflowTemplates.id, id));
      return template;
    } catch (error) {
      console.error("Database error in getTemplateById:", error);
      throw new Error("Database operation failed");
    }
  }

  async getConfigsByRepo(owner: string, repo: string): Promise<Config[]> {
    try {
      const configs = await db
        .select()
        .from(workflowConfigs)
        .where(
          and(
            eq(workflowConfigs.repoOwner, owner),
            eq(workflowConfigs.repoName, repo)
          )
        );
      return configs;
    } catch (error) {
      console.error("Database error in getConfigsByRepo:", error);
      throw new Error("Database operation failed");
    }
  }

  async createConfig(config: InsertConfig): Promise<Config> {
    try {
      const [newConfig] = await db
        .insert(workflowConfigs)
        .values(config)
        .returning();
      return newConfig;
    } catch (error) {
      console.error("Database error in createConfig:", error);
      throw new Error("Database operation failed");
    }
  }

  async addDefaultTemplates() {
    try {
      const defaultTemplates: InsertTemplate[] = [
        {
          name: "Node.js CI",
          description: "Build and test Node.js projects",
          category: "CI",
          yaml: `name: Node.js CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    - run: npm ci
    - run: npm test`
        },
        {
          name: "Deploy to Pages",
          description: "Deploy static content to GitHub Pages",
          category: "CD",
          yaml: `name: Deploy static content to Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    - run: npm ci
    - run: npm run build
    - uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'`
        }
      ];

      // Check if templates exist before adding
      const existingTemplates = await this.getTemplates();
      if (existingTemplates.length === 0) {
        await db.insert(workflowTemplates).values(defaultTemplates);
      }
    } catch (error) {
      console.error("Error adding default templates:", error);
      // Don't throw here as this is initialization code
    }
  }
}

// Initialize storage and add default templates
export const storage = new DatabaseStorage();
void storage.addDefaultTemplates();