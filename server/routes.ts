
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

function handleError(error: unknown, message: string) {
  console.error(`${message}:`, error);
  return { message };
}

export function registerRoutes(app: Express): Server {
  // Get all templates
  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      const response = handleError(error, "Failed to fetch templates");
      res.status(500).json(response);
    }
  });

  // Get template by ID
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const result = paramsSchema.id.safeParse(req.params.id);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getTemplateById(result.data);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      const response = handleError(error, "Failed to fetch template");
      res.status(500).json(response);
    }
  });

  // Get configs by repository
  app.get("/api/configs/:owner/:repo", async (req, res) => {
    try {
      const ownerResult = paramsSchema.owner.safeParse(req.params.owner);
      const repoResult = paramsSchema.repo.safeParse(req.params.repo);

      if (!ownerResult.success || !repoResult.success) {
        return res.status(400).json({ message: "Invalid owner or repo name" });
      }

      const configs = await storage.getConfigsByRepo(ownerResult.data, repoResult.data);
      res.json(configs);
    } catch (error) {
      const response = handleError(error, "Failed to fetch configurations");
      res.status(500).json(response);
    }
  });

  // Create new config
  app.post("/api/configs", async (req, res) => {
    try {
      const result = insertConfigSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid config data",
          errors: result.error.errors 
        });
      }
      const config = await storage.createConfig(result.data);
      res.json(config);
    } catch (error) {
      const response = handleError(error, "Failed to create configuration");
      res.status(500).json(response);
    }
  });

  return createServer(app);
}
