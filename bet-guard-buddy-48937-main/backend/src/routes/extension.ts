import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Use a path relative to this source file so it doesn't depend on process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "..", "data"); // backend/data
const LOG_FILE = path.join(DATA_DIR, "extension_logs.json");

// Legacy location that may have been created if process.cwd() was backend/
const LEGACY_LOG_FILE = path.join(process.cwd(), "backend", "data", "extension_logs.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // If a legacy file exists (created when process.cwd() was different), migrate it
    const exists = await fs.access(LOG_FILE).then(() => true).catch(() => false);
    if (!exists) {
      const legacyExists = await fs.access(LEGACY_LOG_FILE).then(() => true).catch(() => false);
      if (legacyExists) {
        try {
          const raw = await fs.readFile(LEGACY_LOG_FILE, "utf8");
          // attempt to parse and write to new location
          const parsed = JSON.parse(raw || "[]");
          await fs.writeFile(LOG_FILE, JSON.stringify(parsed, null, 2), "utf8");
        } catch (e) {
          // fallback to empty array if parse fails
          await fs.writeFile(LOG_FILE, "[]", "utf8");
        }
      } else {
        await fs.writeFile(LOG_FILE, "[]", "utf8");
      }
    }
  } catch (err) {
    console.error("Failed to ensure data file:", err);
    throw err;
  }
}

async function readLogs(): Promise<any[]> {
  await ensureDataFile();
  const raw = await fs.readFile(LOG_FILE, "utf8");
  return JSON.parse(raw || "[]");
}

async function appendLog(entry: any) {
  // Read current logs, append and write atomically
  const logs = await readLogs();
  logs.push(entry);
  const tmp = LOG_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(logs, null, 2), "utf8");
  await fs.rename(tmp, LOG_FILE);
}

// POST /api/extension/log
// body: { userId?, event: 'visit_start'|'visit_end'|'time_update'|'threat', domain, url, timestamp, meta }
router.post("/log", async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      ...payload,
    };
    await appendLog(entry);
    return res.json({ ok: true, entry });
  } catch (err: any) {
    console.error("/api/extension/log error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// GET /api/extension/stats
// query: userId (optional)
router.get("/stats", async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const logs = await readLogs();
    const filtered = userId ? logs.filter(l => l.userId === userId) : logs;

    // Aggregate basic stats
    const byDomain: Record<string, { visits: number; timeSpent: number }> = {};
    let totalTime = 0;
    let threats = 0;

    for (const l of filtered) {
      const domain = l.domain || "unknown";
      if (!byDomain[domain]) byDomain[domain] = { visits: 0, timeSpent: 0 };
      if (l.event === "visit_start") byDomain[domain].visits += 1;
      if (l.event === "time_update" && typeof l.seconds === "number") {
        byDomain[domain].timeSpent += l.seconds;
        totalTime += l.seconds;
      }
      if (l.event === "threat") threats += 1;
    }

    return res.json({
      ok: true,
      meta: { totalEntries: filtered.length },
      stats: {
        totalTimeSeconds: totalTime,
        threatsDetected: threats,
        domains: byDomain,
      },
    });
  } catch (err: any) {
    console.error("/api/extension/stats error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// POST /api/extension/eval
// body: { userId?, metric: string, value }
router.post("/eval", async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = { type: "eval", timestamp: new Date().toISOString(), ...payload };
    await appendLog(entry);
    return res.json({ ok: true, entry });
  } catch (err: any) {
    console.error("/api/extension/eval error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

export { router as extensionRouter };
