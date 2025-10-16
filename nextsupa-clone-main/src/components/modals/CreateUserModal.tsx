import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateUserModal = ({ open, onClose }: CreateUserModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
  });

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.role || !formData.phone) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    // Generate user code
    const userCode = `U${Math.floor(10000 + Math.random() * 90000)}`;

    const { error } = await supabase.from("users").insert({
      user_code: userCode,
      full_name: formData.fullName,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      status: "Active",
    });

    if (error) {
      toast({ title: "Error creating user", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: `User ${formData.fullName} created successfully!` });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setFormData({ fullName: "", email: "", role: "", phone: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buyer">Buyer</SelectItem>
                <SelectItem value="Seller">Seller</SelectItem>
                <SelectItem value="QC Agent">QC Agent</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
