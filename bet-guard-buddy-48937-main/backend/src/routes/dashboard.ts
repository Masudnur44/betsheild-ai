import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const dashboardRouter = Router();

// All dashboard routes require authentication
dashboardRouter.use(authenticateToken);

// Get dashboard statistics
dashboardRouter.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get spending summary
    const { data: spendingData } = await supabaseAdmin
      .from("spending_entries")
      .select("amount, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    // Get alerts count
    const { count: alertsCount } = await supabaseAdmin
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    // Get achievements count
    const { count: achievementsCount } = await supabaseAdmin
      .from("achievements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Calculate weekly spending
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklySpending = spendingData?.filter(
      (entry) => new Date(entry.created_at) >= weekAgo
    ) || [];

    const weeklyTotal = weeklySpending.reduce((sum, entry) => sum + (entry.amount || 0), 0);

    // Calculate risk events (simplified - you can enhance this)
    const riskEvents = [
      { level: "Low", count: Math.floor(Math.random() * 50) },
      { level: "Medium", count: Math.floor(Math.random() * 30) },
      { level: "High", count: Math.floor(Math.random() * 15) },
      { level: "Critical", count: Math.floor(Math.random() * 5) },
    ];

    // Weekly spending by day
    const weeklySpendingByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const daySpending = weeklySpending.filter(
        (entry) => new Date(entry.created_at).toDateString() === date.toDateString()
      );
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        amount: daySpending.reduce((sum, entry) => sum + (entry.amount || 0), 0),
      };
    });

    res.json({
      totalUsers: 1247, // This would come from admin stats
      activeAlerts: alertsCount || 0,
      achievements: achievementsCount || 0,
      revenue: weeklyTotal * 100, // Simplified calculation
      weeklySpending: weeklySpendingByDay,
      riskEvents,
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

