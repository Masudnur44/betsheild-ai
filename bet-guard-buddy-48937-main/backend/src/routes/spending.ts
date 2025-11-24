import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const spendingRouter = Router();

// All spending routes require authentication
spendingRouter.use(authenticateToken);

// Get all spending entries
spendingRouter.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("spending_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error: any) {
    console.error("Get spending error:", error);
    res.status(500).json({ error: "Failed to fetch spending entries" });
  }
});

// Get spending summary
spendingRouter.get("/summary", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data, error } = await supabaseAdmin
      .from("spending_entries")
      .select("amount, created_at")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const total = data?.reduce((sum, entry) => sum + (entry.amount || 0), 0) || 0;
    const count = data?.length || 0;
    const average = count > 0 ? total / count : 0;

    // Get this month's spending
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = data?.filter(
      (entry) => new Date(entry.created_at) >= monthStart
    ) || [];
    const monthTotal = thisMonth.reduce((sum, entry) => sum + (entry.amount || 0), 0);

    res.json({
      total,
      count,
      average,
      thisMonth: monthTotal,
    });
  } catch (error: any) {
    console.error("Get spending summary error:", error);
    res.status(500).json({ error: "Failed to fetch spending summary" });
  }
});

// Create spending entry
spendingRouter.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { amount, description, date } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const { data, error } = await supabaseAdmin
      .from("spending_entries")
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        description: description || "",
        created_at: date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error: any) {
    console.error("Create spending error:", error);
    res.status(500).json({ error: "Failed to create spending entry" });
  }
});

// Update spending entry
spendingRouter.put("/:id", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { amount, description, date } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from("spending_entries")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({ error: "Spending entry not found" });
    }

    const { data, error } = await supabaseAdmin
      .from("spending_entries")
      .update({
        amount: amount ? parseFloat(amount) : undefined,
        description,
        created_at: date,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Update spending error:", error);
    res.status(500).json({ error: "Failed to update spending entry" });
  }
});

// Delete spending entry
spendingRouter.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { error } = await supabaseAdmin
      .from("spending_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Spending entry deleted successfully" });
  } catch (error: any) {
    console.error("Delete spending error:", error);
    res.status(500).json({ error: "Failed to delete spending entry" });
  }
});

