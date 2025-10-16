import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, HelpCircle, Settings } from "lucide-react";

export const AppBar = () => {
  const { toast } = useToast();

  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">OMPOI Admin</h1>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          <Button
            variant="ghost"
            className="font-medium gap-2"
            onClick={() => toast({ title: "Support page coming soon!", variant: "default" })}
          >
            <HelpCircle className="w-4 h-4" />
            Support
          </Button>
          <Button
            variant="ghost"
            className="font-medium gap-2"
            onClick={() => toast({ title: "Settings coming soon!", variant: "default" })}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Avatar className="w-9 h-9 cursor-pointer bg-primary hover:opacity-90 transition-opacity">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
