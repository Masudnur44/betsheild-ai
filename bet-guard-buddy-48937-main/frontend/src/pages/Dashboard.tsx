import { useState, useEffect } from "react";
import {
  Users,
  Bell,
  Award,
  DollarSign,
  UserPlus,
  FileDown,
  AlertTriangle,
} from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { RecentActivity } from "@/components/RecentActivity";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// ----------------- SEARCH BAR -----------------
function DashboardSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 border rounded-lg w-full"
      />
      <button type="submit" className="px-3 py-2 bg-primary text-white rounded-lg">
        Search
      </button>
    </form>
  );
}

// ----------------- NOTIFICATIONS -----------------
function Notifications({ alerts }: { alerts: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No alerts</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-3 border-b hover:bg-gray-50">
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-gray-500">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ----------------- PROFILE MENU -----------------
function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
          {user?.email[0].toUpperCase() || "U"}
        </div>
        <span>{user?.email.split("@")[0]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg z-50">
          <button className="block w-full text-left p-3 hover:bg-gray-100">
            Profile
          </button>

          <button
            onClick={signOut}
            className="block w-full text-left p-3 text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------- MAIN DASHBOARD -----------------
export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1247,
    activeAlerts: 23,
    achievements: 89,
    revenue: 45820,
    weeklySpending: [
      { day: "Mon", amount: 120 },
      { day: "Tue", amount: 190 },
      { day: "Wed", amount: 145 },
      { day: "Thu", amount: 220 },
      { day: "Fri", amount: 280 },
      { day: "Sat", amount: 310 },
      { day: "Sun", amount: 165 },
    ],
    riskEvents: [
      { level: "Low", count: 45 },
      { level: "Medium", count: 28 },
      { level: "High", count: 12 },
      { level: "Critical", count: 5 },
    ],
  });

  // Notification alerts list
  const [alerts, setAlerts] = useState([
    { id: 1, title: "High Spending Alert", message: "You've exceeded your daily limit" },
    { id: 2, title: "New Report Ready", message: "Weekly report available" },
  ]);

  // Search handling
  const handleSearch = (query: string) => {
    toast({ title: "Search", description: `You searched: ${query}` });
  };

  // ---------------- EXPORT REPORT (JSON) ----------------
  const handleExportReports = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      user: user?.email,
      dashboardData,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard_report.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Report Exported", description: "dashboard_report.json downloaded." });
  };

  // ---------------- SEND ALERT ----------------
  const handleSendAlert = () => {
    const newAlert = {
      id: alerts.length + 1,
      title: "Manual Alert",
      message: "An admin triggered a manual alert.",
    };

    setAlerts([newAlert, ...alerts]);

    toast({
      title: "Alert Sent",
      description: "New alert has been added to notifications.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor gambling behavior and track key metrics
          </p>
        </div>

        <div className="flex items-center gap-4 w-1/3">
          <DashboardSearch onSearch={handleSearch} />
          <Notifications alerts={alerts} />
          <ProfileMenu />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Users" value={dashboardData.totalUsers.toLocaleString()} trend={5} icon={Users} gradient="primary" />
        <KPICard title="Active Alerts" value={dashboardData.activeAlerts} trend={-2} icon={Bell} gradient="danger" />
        <KPICard title="Achievements" value={dashboardData.achievements} trend={10} icon={Award} gradient="warning" />
        <KPICard title="Revenue" value={`$${(dashboardData.revenue / 1000).toFixed(1)}k`} trend={3} icon={DollarSign} gradient="success" />
      </div>

      {/* RISK SCORE + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskScoreMeter score={42} />
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full" /> Weekly Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.weeklySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-destructive rounded-full" /> Risk Events
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.riskEvents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Button size="lg" className="h-14 gap-2">
          <UserPlus className="w-5 h-5" /> Add User
        </Button>

        <Button size="lg" variant="outline" onClick={handleExportReports} className="h-14 gap-2">
          <FileDown className="w-5 h-5" /> Export Reports
        </Button>

        <Button size="lg" variant="destructive" onClick={handleSendAlert} className="h-14 gap-2">
          <AlertTriangle className="w-5 h-5" /> Send Alert
        </Button>
      </div>
    </div>
  );
}
