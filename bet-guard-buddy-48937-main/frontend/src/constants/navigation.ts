import {
  LayoutDashboard,
  DollarSign,
  ScanLine,
  Bell,
  Award,
  FileText,
  Settings,
  Shield,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Spending Tracker",
    icon: DollarSign,
    href: "/spending",
  },
  {
    title: "URL Scanner",
    icon: ScanLine,
    href: "/scanner",
  },
  {
    title: "Alerts",
    icon: Bell,
    href: "/alerts",
  },
  {
    title: "Achievements",
    icon: Award,
    href: "/achievements",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const appName = "BetShield";
export const appIcon = Shield;

