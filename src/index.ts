import http from "http";
import express from "express";
import Logging from "./v1/config/logging.js";
import { PORT } from "./v1/config/config.js";
import loader from "./v1/loaders/index.js";

/**
 * Gracefully shuts down the server
 */
const gracefulShutdown = (server: http.Server, exitCode: number = 0): void => {
  Logging.info("Shutting down gracefully...");

  server.close(() => {
    Logging.info("Server closed");
    process.exit(exitCode);
  });

  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    Logging.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

/**
 * Handles unexpected errors
 */
const unexpectedErrorHandler = (server: http.Server) => {
  return (error: Error) => {
    Logging.error("Unexpected error occurred:");
    Logging.error(error);
    gracefulShutdown(server, 1);
  };
};

/**
 * Starts the Express server
 */
const startServer = async (): Promise<void> => {
  try {
    const app = express();

    // Load all configurations, middleware, and routes
    await loader(app);

    const httpServer = http.createServer(app);

    const server = httpServer.listen(PORT, () => {
      Logging.info(`Server is running on port ${PORT}`);
      Logging.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        Logging.error(`Port ${PORT} is already in use`);
      } else {
        Logging.error("Server error: " + JSON.stringify(error));
      }
      process.exit(1);
    });

    // Graceful shutdown on SIGTERM (e.g., from Docker, Kubernetes)
    process.on("SIGTERM", () => {
      Logging.info("SIGTERM signal received");
      gracefulShutdown(server, 0);
    });

    // Graceful shutdown on SIGINT (e.g., Ctrl+C)
    process.on("SIGINT", () => {
      Logging.info("SIGINT signal received");
      gracefulShutdown(server, 0);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", unexpectedErrorHandler(server));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", unexpectedErrorHandler(server));
  } catch (error) {
    Logging.error("Failed to start server:");
    Logging.error(error);
    process.exit(1);
  }
};

// Start the server
startServer();
