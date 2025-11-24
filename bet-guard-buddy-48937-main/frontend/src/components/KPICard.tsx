import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  gradient?: "primary" | "success" | "warning" | "danger";
  delay?: number;
}

export function KPICard({
  title,
  value,
  trend,
  icon: Icon,
  gradient = "primary",
  delay = 0,
}: KPICardProps) {
  const gradientClasses = {
    primary: "from-primary to-primary/70",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-destructive to-destructive/70",
  };

  return (
    <Card
      className={cn(
        "p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in",
        `bg-gradient-to-br ${gradientClasses[gradient]}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend !== undefined && (
            <p
              className={cn(
                "text-sm mt-2",
                trend >= 0 ? "text-green-200" : "text-red-200"
              )}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

