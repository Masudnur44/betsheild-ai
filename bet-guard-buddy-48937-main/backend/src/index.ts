import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { spendingRouter } from "./routes/spending.js";
import { scannerRouter } from "./routes/scanner.js";
import { alertsRouter } from "./routes/alerts.js";
import { achievementsRouter } from "./routes/achievements.js";
import { reportsRouter } from "./routes/reports.js";
import { settingsRouter } from "./routes/settings.js";
import { extensionRouter } from "./routes/extension.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware: dynamic CORS that supports comma-separated origins
{
  const raw = CORS_ORIGIN || "";
  const allowedOrigins = raw.split(",").map(s => s.trim()).filter(Boolean); // e.g. "http://localhost:5173,http://localhost:5175"

  app.use(cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // allow browser extension origins (chrome/moz extension schemes)
      if (typeof origin === "string" && (origin.startsWith("chrome-extension://") || origin.startsWith("moz-extension://"))) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`Blocked CORS origin: ${origin}`);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BetShield API is running" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/spending", spendingRouter);
app.use("/api/scanner", scannerRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/extension", extensionRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err?.message ?? err);
  // If the error came from CORS origin check, return 403
  if (err && String(err.message).toLowerCase().includes("cors origin")) {
    return res.status(403).json({ error: "CORS origin not allowed" });
  }
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err?.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
});