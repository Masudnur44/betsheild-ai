import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface RiskScoreMeterProps {
  score: number;
}

export function RiskScoreMeter({ score }: RiskScoreMeterProps) {
  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: "Low", color: "text-green-600" };
    if (score < 50) return { label: "Moderate", color: "text-yellow-600" };
    if (score < 75) return { label: "High", color: "text-orange-600" };
    return { label: "Critical", color: "text-red-600" };
  };

  const risk = getRiskLevel(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-6 shadow-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-bold">Risk Score</h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
          </div>
        </div>
        <p className={`mt-4 text-lg font-semibold ${risk.color}`}>
          {risk.label} Risk
        </p>
      </div>
    </Card>
  );
}

