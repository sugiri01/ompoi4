import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend: {
    direction: "up" | "down";
    value: string;
  };
  iconVariant: "success" | "warning" | "info" | "danger";
  onClick?: () => void;
}

export const StatCard = ({ label, value, icon: Icon, trend, iconVariant, onClick }: StatCardProps) => {
  const iconBg = {
    success: "bg-success-bg",
    warning: "bg-warning-bg",
    info: "bg-blue-bg",
    danger: "bg-danger-bg",
  };

  const iconColor = {
    success: "text-success-text",
    warning: "text-warning-text",
    info: "text-blue-text",
    danger: "text-danger-text",
  };

  const trendBg = {
    up: "bg-success-bg text-success-text",
    down: "bg-danger-bg text-danger-text",
  };

  const TrendIcon = trend.direction === "up" ? TrendingUp : TrendingDown;

  return (
    <Card
      className="p-6 shadow-soft hover:shadow-med hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground tracking-wide">{label}</p>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          iconBg[iconVariant]
        )}>
          <Icon className={cn("w-6 h-6", iconColor[iconVariant])} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-3xl font-extrabold mb-3 tracking-tight">{value}</p>
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold",
        trendBg[trend.direction]
      )}>
        <TrendIcon className="w-3.5 h-3.5" />
        <span>{trend.value}</span>
      </div>
    </Card>
  );
};
