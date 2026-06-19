import express from "express";
import cors from "cors";
import routes from "./routes/routes";

const app = express();

app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Register API routes
app.use("/api", routes);

// Generic error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
  });
});

export default app;
