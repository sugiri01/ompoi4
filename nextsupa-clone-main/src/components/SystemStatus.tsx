import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, XCircle, LucideIcon } from "lucide-react";

export const SystemStatus = () => {
  const { toast } = useToast();

  const { data: statuses = [] } = useQuery({
    queryKey: ["system_status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_status")
        .select("*")
        .order("service_name");
      if (error) throw error;
      return data;
    },
  });

  const getStatusStyle = (status: string): {
    bg: string;
    icon: LucideIcon;
    iconColor: string;
    textColor: string;
  } => {
    const styles = {
      Operational: {
        bg: "bg-success-bg border-success-border",
        icon: CheckCircle2,
        iconColor: "text-success-text",
        textColor: "text-success-text",
      },
      Warning: {
        bg: "bg-warning-bg border-warning-border",
        icon: AlertTriangle,
        iconColor: "text-warning-text",
        textColor: "text-warning-text",
      },
      Error: {
        bg: "bg-danger-bg border-danger-border",
        icon: XCircle,
        iconColor: "text-danger-text",
        textColor: "text-danger-text",
      },
    };
    return styles[status as keyof typeof styles] || styles.Operational;
  };

  return (
    <Card className="shadow-med">
      <CardHeader className="border-b border-border px-6 py-4">
        <CardTitle className="text-lg font-bold">System Status (IT)</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3">
          {statuses.map((status) => {
            const style = getStatusStyle(status.status);
            const StatusIcon = style.icon;
            return (
              <div
                key={status.id}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm",
                  style.bg
                )}
                onClick={() => toast({ title: `${status.service_name}: ${status.message}` })}
              >
                <div className="w-11 h-11 bg-card rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <StatusIcon className={cn("w-5 h-5", style.iconColor)} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1 tracking-wide">{status.service_name}</p>
                  <p className={cn("text-xs leading-relaxed", style.textColor)}>{status.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
