import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfigSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/templates", async (_req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  app.get("/api/templates/:id", async (req, res) => {
    const template = await storage.getTemplateById(Number(req.params.id));
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.json(template);
  });

  app.get("/api/configs/:owner/:repo", async (req, res) => {
    const { owner, repo } = req.params;
    const configs = await storage.getConfigsByRepo(owner, repo);
    res.json(configs);
  });

  app.post("/api/configs", async (req, res) => {
    const result = insertConfigSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid config data" });
      return;
    }
    const config = await storage.createConfig(result.data);
    res.json(config);
  });

  const httpServer = createServer(app);
  return httpServer;
}
