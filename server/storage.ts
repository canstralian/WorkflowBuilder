import { type Template, type InsertTemplate, type Config, type InsertConfig } from "@shared/schema";

export interface IStorage {
  getTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getConfigsByRepo(owner: string, repo: string): Promise<Config[]>;
  createConfig(config: InsertConfig): Promise<Config>;
}

export class MemStorage implements IStorage {
  private templates: Map<number, Template>;
  private configs: Map<number, Config>;
  private nextTemplateId = 1;
  private nextConfigId = 1;

  constructor() {
    this.templates = new Map();
    this.configs = new Map();
    
    // Add some default templates
    this.addDefaultTemplates();
  }

  private addDefaultTemplates() {
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

    defaultTemplates.forEach(template => {
      const id = this.nextTemplateId++;
      this.templates.set(id, { ...template, id });
    });
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getConfigsByRepo(owner: string, repo: string): Promise<Config[]> {
    return Array.from(this.configs.values()).filter(
      config => config.repoOwner === owner && config.repoName === repo
    );
  }

  async createConfig(config: InsertConfig): Promise<Config> {
    const id = this.nextConfigId++;
    const newConfig = { ...config, id };
    this.configs.set(id, newConfig);
    return newConfig;
  }
}

export const storage = new MemStorage();
