import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Truck, Tag, LucideIcon } from "lucide-react";

export const QuickActions = () => {
  const { toast } = useToast();

  const actions: {
    icon: LucideIcon;
    title: string;
    description: string;
    bg: string;
    iconColor: string;
    action: () => void;
  }[] = [
    {
      icon: BarChart3,
      title: "Generate Report",
      description: "Run monthly operational reports.",
      bg: "bg-success-bg",
      iconColor: "text-success-text",
      action: () => {
        toast({ title: "Generating monthly operational report..." });
        setTimeout(() => toast({ title: "Report generated successfully!" }), 1500);
      },
    },
    {
      icon: Truck,
      title: "Shipment Tracker",
      description: "Monitor all active logistics status.",
      bg: "bg-blue-bg",
      iconColor: "text-blue-text",
      action: () => toast({ title: "Loading shipment tracking dashboard..." }),
    },
    {
      icon: Tag,
      title: "Manage Product Catalog",
      description: "Update pricing and product details.",
      bg: "bg-warning-bg",
      iconColor: "text-warning-text",
      action: () => toast({ title: "Opening product catalog management..." }),
    },
  ];

  return (
    <Card className="shadow-med">
      <CardHeader className="border-b border-border px-6 py-4">
        <CardTitle className="text-lg font-bold">Quick Operations Access</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3">
          {actions.map((action, i) => {
            const IconComponent = action.icon;
            return (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 bg-soft-bg rounded-xl cursor-pointer transition-all hover:bg-card hover:border-primary hover:shadow-sm border border-transparent"
                onClick={action.action}
              >
                <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <IconComponent className={`w-5 h-5 ${action.iconColor}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1 tracking-wide">{action.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
