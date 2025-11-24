import { useState, useEffect } from "react";
import { Award, Trophy, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Achievements() {
  const defaultAchievements = [
    {
      id: 1,
      title: "First Week Clean",
      description: "No gambling activity for 7 days",
      icon: Trophy,
      unlocked: false,
      date: null,
    },
    {
      id: 2,
      title: "Budget Master",
      description: "Stayed within budget for a month",
      icon: Star,
      unlocked: false,
      date: null,
    },
    {
      id: 3,
      title: "Alert Responder",
      description: "Responded to 10 alerts",
      icon: Award,
      unlocked: false,
      date: null,
    },
  ];

  const [achievements, setAchievements] = useState([]);

  // Load achievements from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("achievements");
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements(defaultAchievements);
    }
  }, []);

  // Save to LocalStorage whenever achievements change
  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Unlock an achievement
  const unlockAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, unlocked: true, date: new Date().toISOString().split("T")[0] }
          : a
      )
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your progress and milestones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;

          return (
            <Card
              key={achievement.id}
              className={`p-6 shadow-lg transition-all duration-200 ${
                achievement.unlocked
                  ? "border-primary"
                  : "opacity-60 border-muted"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    achievement.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    {achievement.unlocked && (
                      <Badge variant="default">Unlocked</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>

                  {achievement.unlocked && achievement.date && (
                    <p className="text-xs text-muted-foreground">
                      Unlocked: {achievement.date}
                    </p>
                  )}

                  {!achievement.unlocked && (
                    <Button
                      className="mt-3"
                      onClick={() => unlockAchievement(achievement.id)}
                    >
                      Unlock Achievement
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
