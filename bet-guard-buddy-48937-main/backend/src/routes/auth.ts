import { Router } from "express";
import { supabaseAdmin } from "../config/supabase.js";

export const authRouter = Router();

// Sign up
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role },
      email_confirm: true, // Auto-confirm email for development
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Sign in
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: "Signed in successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "user",
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// Admin sign in
authRouter.post("/admin/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Check if user is admin
    const role = data.user.user_metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    res.json({
      message: "Admin signed in successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: "admin",
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    });
  } catch (error: any) {
    console.error("Admin signin error:", error);
    res.status(500).json({ error: "Failed to sign in as admin" });
  }
});

// Sign out
authRouter.post("/signout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }

    res.json({ message: "Signed out successfully" });
  } catch (error: any) {
    console.error("Signout error:", error);
    res.status(500).json({ error: "Failed to sign out" });
  }
});

// Verify token
authRouter.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || "user",
      },
    });
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Failed to verify token" });
  }
});

