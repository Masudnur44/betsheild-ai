import { Card } from "@/components/ui/card";
import { Clock, DollarSign, AlertTriangle } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      type: "spending",
      message: "Spent $50 on gambling site",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      type: "alert",
      message: "High spending alert triggered",
      time: "5 hours ago",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      type: "spending",
      message: "Spent $25 on gambling site",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      type: "alert",
      message: "URL scan detected gambling site",
      time: "2 days ago",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ];

  return (
    <Card className="p-6 shadow-lg animate-fade-in">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-6 bg-primary rounded-full"></div>
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

