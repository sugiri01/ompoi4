import { Button } from "./ui/button";
import { Settings, UserPlus } from "lucide-react";

interface DashboardHeaderProps {
  onCreateUser: () => void;
  onITSettings: () => void;
}

export const DashboardHeader = ({ onCreateUser, onITSettings }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h2 className="text-3xl font-extrabold mb-1.5 tracking-tight">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground font-medium">Overview for Operations & IT Management</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onITSettings} className="gap-2">
          <Settings className="w-4 h-4" />
          IT Settings
        </Button>
        <Button onClick={onCreateUser} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Create New User
        </Button>
      </div>
    </div>
  );
};
