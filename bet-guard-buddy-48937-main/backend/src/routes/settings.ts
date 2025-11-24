import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { supabaseAdmin } from "../config/supabase.js";

export const settingsRouter = Router();

// All settings routes require authentication
settingsRouter.use(authenticateToken);

// Get user profile
settingsRouter.get("/profile", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role || "user",
      createdAt: user.created_at,
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update profile
settingsRouter.put("/profile", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const updateData: any = {};
    if (name) updateData.user_metadata = { name };
    if (email) updateData.email = email;

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updateData
    );

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      role: data.user.user_metadata?.role || "user",
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Update password
settingsRouter.put("/password", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Get user settings
settingsRouter.get("/settings", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get settings from database (you'd create a settings table)
    // For now, return default settings
    res.json({
      emailNotifications: true,
      spendingAlerts: true,
      alertThreshold: 100,
      theme: "light",
    });
  } catch (error: any) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Update user settings
settingsRouter.put("/settings", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const settings = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Save settings to database (you'd create a settings table)
    // For now, just return the updated settings
    res.json({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Delete account
settingsRouter.delete("/account", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

