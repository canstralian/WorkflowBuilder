import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfigSchema } from "@shared/schema";
import { z } from "zod";

const paramsSchema = {
  id: z.coerce.number().positive("Invalid template ID"),
  owner: z.string().min(1, "Repository owner is required"),
  repo: z.string().min(1, "Repository name is required")
};

export function registerRoutes(app: Express): Server {
  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const result = paramsSchema.id.safeParse(req.params.id);
      if (!result.success) {
        res.status(400).json({ message: "Invalid template ID" });
        return;
      }

      const template = await storage.getTemplateById(result.data);
      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.get("/api/configs/:owner/:repo", async (req, res) => {
    try {
      const ownerResult = paramsSchema.owner.safeParse(req.params.owner);
      const repoResult = paramsSchema.repo.safeParse(req.params.repo);

      if (!ownerResult.success || !repoResult.success) {
        res.status(400).json({ message: "Invalid owner or repo name" });
        return;
      }

      const configs = await storage.getConfigsByRepo(ownerResult.data, repoResult.data);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching configs:", error);
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.post("/api/configs", async (req, res) => {
    try {
      const result = insertConfigSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ 
          message: "Invalid config data",
          errors: result.error.errors 
        });
        return;
      }
      const config = await storage.createConfig(result.data);
      res.json(config);
    } catch (error) {
      console.error("Error creating config:", error);
      res.status(500).json({ message: "Failed to create configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}