import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, CreditCard, FileEdit, ClipboardList } from "lucide-react";

export const OperationsQueue = () => {
  const { toast } = useToast();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profileChanges = [] } = useQuery({
    queryKey: ["profile_changes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_change_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "Pending QC": "bg-warning-bg text-warning-text border-warning-border",
      Hold: "bg-danger-bg text-danger-text border-danger-border",
      Pending: "bg-blue-bg text-blue-text border-blue-border",
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="shadow-med">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
            <ClipboardList className="w-5 h-5 text-primary" />
            Operations Review Queue{" "}
            <span className="text-xs text-primary font-semibold">(Ops Admin)</span>
          </CardTitle>
          <Button
            variant="link"
            className="text-primary font-medium"
            onClick={() => toast({ title: "Loading full operations queue..." })}
          >
            View Full Queue
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-3.5 bg-soft-bg rounded-xl hover:bg-card transition-colors border border-transparent hover:border-border">
              <div className="w-10 h-10 rounded-xl bg-warning-bg flex items-center justify-center">
                <Package className="w-5 h-5 text-warning-text" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1 tracking-wide">
                  #{order.order_code}: {order.product_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Action: {order.action_required} | Seller: {order.seller_name}
                </p>
              </div>
              <Badge className={getStatusBadge(order.status)} variant="outline">
                {order.status}
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toast({ title: `Reviewing order ${order.order_code}` })}
              >
                Review
              </Button>
            </div>
          ))}

          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-4 p-3.5 bg-soft-bg rounded-xl hover:bg-card transition-colors border border-transparent hover:border-border">
              <div className="w-10 h-10 rounded-xl bg-blue-bg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-text" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1 tracking-wide">
                  #{txn.txn_code}: ${txn.amount.toLocaleString()} Payment
                </p>
                <p className="text-xs text-muted-foreground">
                  Action: {txn.action_required} | Buyer: {txn.buyer_name}
                </p>
              </div>
              <Badge className={getStatusBadge(txn.status)} variant="outline">
                {txn.status}
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toast({ title: `Approving transaction ${txn.txn_code}` })}
              >
                Approve
              </Button>
            </div>
          ))}

          {profileChanges.map((change) => (
            <div key={change.id} className="flex items-center gap-4 p-3.5 bg-soft-bg rounded-xl hover:bg-card transition-colors border border-transparent hover:border-border">
              <div className="w-10 h-10 rounded-xl bg-success-bg flex items-center justify-center">
                <FileEdit className="w-5 h-5 text-success-text" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1 tracking-wide">
                  #{change.report_code}: User Profile Change
                </p>
                <p className="text-xs text-muted-foreground">
                  Action: {change.change_type}
                </p>
              </div>
              <Badge className={getStatusBadge(change.status)} variant="outline">
                Verification
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toast({ title: `Verifying change ${change.report_code}` })}
              >
                Verify
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
