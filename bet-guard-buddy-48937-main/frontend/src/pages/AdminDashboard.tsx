import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage users and system settings
        </p>
      </div>

      <Card className="p-6 shadow-lg">
        <p className="text-muted-foreground">Admin features coming soon...</p>
      </Card>
    </div>
  );
}

