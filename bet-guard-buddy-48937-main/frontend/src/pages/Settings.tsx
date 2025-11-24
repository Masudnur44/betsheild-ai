import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Local state for editable fields
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [spendingAlerts, setSpendingAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // TODO: Replace this with backend API call to save settings
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Preferences Card */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Spending Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when spending exceeds limits
                </p>
              </div>
              <input
                type="checkbox"
                checked={spendingAlerts}
                onChange={(e) => setSpendingAlerts(e.target.checked)}
              />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-destructive">
            Danger Zone
          </h2>
          <Button variant="destructive" onClick={signOut}>
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
