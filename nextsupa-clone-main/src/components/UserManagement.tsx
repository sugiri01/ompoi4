import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Users } from "lucide-react";

interface User {
  id: string;
  user_code: string;
  full_name: string;
  role: string;
  status: string;
  last_login: string | null;
}

interface UserManagementProps {
  onManageUser: (user: User) => void;
  onUnlockUser: (user: User) => void;
  onVerifyUser: (user: User) => void;
}

export const UserManagement = ({ onManageUser, onUnlockUser, onVerifyUser }: UserManagementProps) => {
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never";
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-success-bg text-success-text border-success-border",
      Locked: "bg-danger-bg text-danger-text border-danger-border",
      Pending: "bg-warning-bg text-warning-text border-warning-border",
      Suspended: "bg-danger-bg text-danger-text border-danger-border",
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return <Card className="shadow-med"><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card className="shadow-med">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
            <Users className="w-5 h-5 text-primary" />
            User & Access Control{" "}
            <span className="text-xs text-primary font-semibold">(IT Admin)</span>
          </CardTitle>
          <Button
            variant="link"
            className="text-primary font-medium"
            onClick={() => toast({ title: "Loading all users..." })}
          >
            View All Users
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-3.5 bg-soft-bg rounded-xl hover:bg-card transition-colors border border-transparent hover:border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1 tracking-wide">
                  #{user.user_code}: {user.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Role: {user.role} | Last Login: {formatLastLogin(user.last_login)}
                </p>
              </div>
              <Badge className={getStatusBadge(user.status)} variant="outline">
                {user.status}
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() =>
                  user.status === "Locked"
                    ? onUnlockUser(user)
                    : user.status === "Pending"
                    ? onVerifyUser(user)
                    : onManageUser(user)
                }
              >
                {user.status === "Locked" ? "Unlock" : user.status === "Pending" ? "Verify" : "Manage"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
