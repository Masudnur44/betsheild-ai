const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Helper function to get auth token
function getAuthToken(): string | null {
  // Get token from localStorage or sessionStorage
  const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  return token;
}

// Helper function to set auth token
export function setAuthToken(token: string, remember: boolean = false): void {
  if (remember) {
    localStorage.setItem("auth_token", token);
  } else {
    sessionStorage.setItem("auth_token", token);
  }
}

// Helper function to remove auth token
export function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
}

// Base fetch function with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Request failed" };
    }

    return { data };
  } catch (error: any) {
    console.error("API Error:", error);
    return { error: error.message || "Network error" };
  }
}

// Auth API
export const authApi = {
  signUp: async (email: string, password: string, role: string = "user") => {
    const result = await apiFetch<{ user: any; session: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
    
    if (result.data?.session?.access_token) {
      setAuthToken(result.data.session.access_token);
    }
    
    return result;
  },

  signIn: async (email: string, password: string) => {
    const result = await apiFetch<{ user: any; session: any }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (result.data?.session?.access_token) {
      setAuthToken(result.data.session.access_token);
    }
    
    return result;
  },

  adminSignIn: async (email: string, password: string) => {
    const result = await apiFetch<{ user: any; session: any }>("/auth/admin/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (result.data?.session?.access_token) {
      setAuthToken(result.data.session.access_token);
    }
    
    return result;
  },

  signOut: async () => {
    await apiFetch("/auth/signout", {
      method: "POST",
    });
    removeAuthToken();
  },

  verify: async () => {
    return apiFetch<{ user: any }>("/auth/verify");
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return apiFetch("/dashboard");
  },
};

// Spending API
export const spendingApi = {
  getAll: async () => {
    return apiFetch("/spending");
  },

  getSummary: async () => {
    return apiFetch("/spending/summary");
  },

  create: async (amount: number, description: string, date?: string) => {
    return apiFetch("/spending", {
      method: "POST",
      body: JSON.stringify({ amount, description, date }),
    });
  },

  update: async (id: string, amount?: number, description?: string, date?: string) => {
    return apiFetch(`/spending/${id}`, {
      method: "PUT",
      body: JSON.stringify({ amount, description, date }),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/spending/${id}`, {
      method: "DELETE",
    });
  },
};

// Scanner API
export const scannerApi = {
  scan: async (url: string) => {
    return apiFetch("/scanner", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  getHistory: async () => {
    return apiFetch("/scanner/history");
  },
};

// Alerts API
export const alertsApi = {
  getAll: async () => {
    return apiFetch("/alerts");
  },

  markRead: async (id: string) => {
    return apiFetch(`/alerts/${id}/read`, {
      method: "PATCH",
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/alerts/${id}`, {
      method: "DELETE",
    });
  },
};

// Achievements API
export const achievementsApi = {
  getAll: async () => {
    return apiFetch("/achievements");
  },
};

// Reports API
export const reportsApi = {
  getAll: async () => {
    return apiFetch("/reports");
  },

  generate: async (type: string, startDate?: string, endDate?: string) => {
    return apiFetch("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ type, startDate, endDate }),
    });
  },

  download: async (id: string) => {
    return apiFetch(`/reports/${id}/download`);
  },
};

// Settings API
export const settingsApi = {
  getProfile: async () => {
    return apiFetch("/settings/profile");
  },

  updateProfile: async (name?: string, email?: string) => {
    return apiFetch("/settings/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
  },

  updatePassword: async (password: string) => {
    return apiFetch("/settings/password", {
      method: "PUT",
      body: JSON.stringify({ password }),
    });
  },

  getSettings: async () => {
    return apiFetch("/settings/settings");
  },

  updateSettings: async (settings: any) => {
    return apiFetch("/settings/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  deleteAccount: async () => {
    return apiFetch("/settings/account", {
      method: "DELETE",
    });
  },
};

