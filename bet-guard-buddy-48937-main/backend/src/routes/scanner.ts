import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const scannerRouter = Router();

// All scanner routes require authentication
scannerRouter.use(authenticateToken);

// Scan URL for gambling sites
scannerRouter.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { url } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Simple gambling site detection (you can enhance this with ML/AI)
    const gamblingKeywords = [
      "bet", "casino", "poker", "slot", "gambling", "wager", "stake",
      "jackpot", "lottery", "bingo", "roulette", "blackjack"
    ];

    const urlLower = url.toLowerCase();
    const isGambling = gamblingKeywords.some(keyword => urlLower.includes(keyword));
    const riskLevel = isGambling ? "high" : "low";

    // Save scan to database
    const { data, error } = await supabaseAdmin
      .from("url_scans")
      .insert({
        user_id: userId,
        url,
        is_gambling: isGambling,
        risk_level: riskLevel,
        scanned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      ...data,
      message: isGambling 
        ? "⚠️ Gambling site detected!" 
        : "✓ No gambling content detected",
    });
  } catch (error: any) {
    console.error("Scan URL error:", error);
    res.status(500).json({ error: "Failed to scan URL" });
  }
});

// Get scan history
scannerRouter.get("/history", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("url_scans")
      .select("*")
      .eq("user_id", userId)
      .order("scanned_at", { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error: any) {
    console.error("Get scan history error:", error);
    res.status(500).json({ error: "Failed to fetch scan history" });
  }
});

