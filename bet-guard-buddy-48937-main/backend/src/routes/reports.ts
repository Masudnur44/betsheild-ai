import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const reportsRouter = Router();

// All reports routes require authentication
reportsRouter.use(authenticateToken);

// Get all reports
reportsRouter.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error: any) {
    console.error("Get reports error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Generate new report
reportsRouter.post("/generate", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { type, startDate, endDate } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get spending data for the period
    const { data: spendingData } = await supabaseAdmin
      .from("spending_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate || new Date(0).toISOString())
      .lte("created_at", endDate || new Date().toISOString());

    const totalSpending = spendingData?.reduce((sum, entry) => sum + (entry.amount || 0), 0) || 0;

    // Create report
    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: userId,
        type: type || "spending",
        title: `${type || "Spending"} Report - ${new Date().toLocaleDateString()}`,
        data: {
          totalSpending,
          entryCount: spendingData?.length || 0,
          period: { startDate, endDate },
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error: any) {
    console.error("Generate report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// Download report
reportsRouter.get("/:id/download", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Report not found" });
    }

    // In a real app, you'd generate a PDF or CSV here
    res.json({
      ...data,
      downloadUrl: `/api/reports/${id}/file`, // Placeholder
    });
  } catch (error: any) {
    console.error("Download report error:", error);
    res.status(500).json({ error: "Failed to download report" });
  }
});

