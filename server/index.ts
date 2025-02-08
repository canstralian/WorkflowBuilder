
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

function setupMiddleware(app: express.Express) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

function setupLogging(app: express.Express) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let responseBody: Record<string, any> | undefined;

    const originalJson = res.json;
    res.json = function(body, ...args) {
      responseBody = body;
      return originalJson.apply(res, [body, ...args]);
    };

    res.on("finish", () => {
      if (path.startsWith("/api")) {
        const duration = Date.now() - start;
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        
        if (responseBody) {
          const responseSummary = JSON.stringify(responseBody);
          logLine += ` :: ${responseSummary.slice(0, 79)}${responseSummary.length > 79 ? '…' : ''}`;
        }
        
        log(logLine);
      }
    });

    next();
  });
}

function setupErrorHandler(app: express.Express) {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
}

(async () => {
  const app = express();
  setupMiddleware(app);
  setupLogging(app);

  const server = registerRoutes(app);
  setupErrorHandler(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();
