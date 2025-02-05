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
    return await db.select().from(workflowTemplates);
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    const [template] = await db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.id, id));
    return template;
  }

  async getConfigsByRepo(owner: string, repo: string): Promise<Config[]> {
    return await db
      .select()
      .from(workflowConfigs)
      .where(
        and(
          eq(workflowConfigs.repoOwner, owner),
          eq(workflowConfigs.repoName, repo)
        )
      );
  }

  async createConfig(config: InsertConfig): Promise<Config> {
    const [newConfig] = await db
      .insert(workflowConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  // Add default templates on initialization
  async addDefaultTemplates() {
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

    // Only add templates if none exist
    const existingTemplates = await this.getTemplates();
    if (existingTemplates.length === 0) {
      await db.insert(workflowTemplates).values(defaultTemplates);
    }
  }
}

// Initialize storage and add default templates
export const storage = new DatabaseStorage();
void storage.addDefaultTemplates();