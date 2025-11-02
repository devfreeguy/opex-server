import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Logging from "./v1/config/logging.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";
import { allowedOrigins } from "./v1/utils/cors.utils.js";
import { baseUrl } from "./v1/utils/text.utils.js";

// Route imports
import { authRoute } from "./v1/routes/auth.route.js";

export default async function setup(app: Application): Promise<Application> {
  // Logging middleware - should be first to log all requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logging.info(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      Logging.info(
        `Completed -> Method: [${req.method}] - URL: [${req.url}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  // CORS configuration
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parser
  app.use(cookieParser());

  // Health check route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      message: "Server is running",
    });
  });

  // API routes
  app.use(baseUrl("/auth"), authRoute);

  // 404 handler - must be after all routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  // Error handling middleware - must be last
  app.use(errorMiddleware);

  return app;
}
