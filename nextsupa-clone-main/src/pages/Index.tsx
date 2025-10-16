import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatCard } from "@/components/StatCard";
import { UserManagement } from "@/components/UserManagement";
import { OperationsQueue } from "@/components/OperationsQueue";
import { SystemStatus } from "@/components/SystemStatus";
import { QuickActions } from "@/components/QuickActions";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { ManageUserModal } from "@/components/modals/ManageUserModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Package, Monitor, UserPlus, AlertCircle, LucideIcon } from "lucide-react";

interface User {
  id: string;
  user_code: string;
  full_name: string;
  role: string;
  status: string;
  last_login: string | null;
}

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [manageUserOpen, setManageUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch dashboard statistics from backend
  const { data: dashboardStats = [] } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboard_stats")
        .select("*")
        .order("stat_key");
      if (error) throw error;
      return data;
    },
  });

  // Map icon variants to Lucide icons
  const getIconComponent = (statKey: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      pending_orders: Package,
      system_uptime: Monitor,
      new_registrations: UserPlus,
      support_tickets: AlertCircle,
    };
    return iconMap[statKey] || Package;
  };

  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setManageUserOpen(true);
  };

  const handleUnlockUser = async (user: User) => {
    const { error } = await supabase
      .from("users")
      .update({ status: "Active" })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error unlocking user", variant: "destructive" });
      return;
    }

    toast({ title: `Account unlocked for ${user.full_name}` });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleVerifyUser = async (user: User) => {
    const { error } = await supabase
      .from("users")
      .update({ status: "Active" })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error verifying user", variant: "destructive" });
      return;
    }

    toast({ title: `Email verified for ${user.full_name}` });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="min-h-screen pb-20">
      <AppBar />

      <div className="max-w-7xl mx-auto px-5 py-5">
        <DashboardHeader
          onCreateUser={() => setCreateUserOpen(true)}
          onITSettings={() => toast({ title: "Opening IT Settings panel..." })}
        />

        {/* Stats Grid - Data driven from backend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.stat_label}
              value={stat.stat_value}
              icon={getIconComponent(stat.stat_key)}
              iconVariant={stat.icon_variant as "success" | "warning" | "info" | "danger"}
              trend={{
                direction: stat.trend_direction as "up" | "down",
                value: stat.trend_value,
              }}
              onClick={() => toast({ title: `${stat.stat_label}: ${stat.stat_value}` })}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
          {/* Left Column */}
          <div className="grid gap-5">
            <UserManagement
              onManageUser={handleManageUser}
              onUnlockUser={handleUnlockUser}
              onVerifyUser={handleVerifyUser}
            />
            <OperationsQueue />
          </div>

          {/* Right Sidebar */}
          <div className="grid gap-5">
            <SystemStatus />
            <QuickActions />
          </div>
        </div>
      </div>

      <CreateUserModal open={createUserOpen} onClose={() => setCreateUserOpen(false)} />
      <ManageUserModal open={manageUserOpen} onClose={() => setManageUserOpen(false)} user={selectedUser} />
    </div>
  );
};

export default Index;
