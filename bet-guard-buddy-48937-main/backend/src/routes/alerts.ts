import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const alertsRouter = Router();

// All alerts routes require authentication
alertsRouter.use(authenticateToken);

// Get all alerts
alertsRouter.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error: any) {
    console.error("Get alerts error:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Mark alert as read
alertsRouter.patch("/:id/read", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("alerts")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Mark alert read error:", error);
    res.status(500).json({ error: "Failed to mark alert as read" });
  }
});

// Delete alert
alertsRouter.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { error } = await supabaseAdmin
      .from("alerts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Alert deleted successfully" });
  } catch (error: any) {
    console.error("Delete alert error:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

