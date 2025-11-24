import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Alerts() {
  const defaultAlerts = [
    {
      id: 1,
      title: "High Spending Alert",
      message: "You've exceeded your daily spending limit",
      type: "warning",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Gambling Site Detected",
      message: "A gambling website was detected in your browsing history",
      type: "danger",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Weekly Report Ready",
      message: "Your weekly spending report is now available",
      type: "info",
      time: "1 day ago",
    },
  ];

  const [alerts, setAlerts] = useState([]);

  // Load alerts from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("alerts");
    if (saved) {
      setAlerts(JSON.parse(saved));
    } else {
      setAlerts(defaultAlerts);
    }
  }, []);

  // Save whenever alerts change
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Dismiss alert
  const dismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Alerts
        </h1>
        <p className="text-muted-foreground">View and manage your alerts</p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No alerts available 🎉
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === "danger"
                        ? "bg-destructive/10 text-destructive"
                        : alert.type === "warning"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {alert.type === "danger" || alert.type === "warning" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge
                        variant={
                          alert.type === "danger" ? "destructive" : "secondary"
                        }
                      >
                        {alert.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
