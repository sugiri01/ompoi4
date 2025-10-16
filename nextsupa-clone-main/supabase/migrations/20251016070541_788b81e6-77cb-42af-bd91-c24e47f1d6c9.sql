-- Create dashboard_stats table to store all dashboard metrics
CREATE TABLE public.dashboard_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key text NOT NULL UNIQUE,
  stat_label text NOT NULL,
  stat_value text NOT NULL,
  icon_variant text NOT NULL DEFAULT 'info',
  trend_direction text NOT NULL DEFAULT 'up',
  trend_value text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (public dashboard)
CREATE POLICY "Allow all on dashboard_stats"
  ON public.dashboard_stats
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_dashboard_stats_updated_at
  BEFORE UPDATE ON public.dashboard_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial dashboard statistics
INSERT INTO public.dashboard_stats (stat_key, stat_label, stat_value, icon_variant, trend_direction, trend_value) VALUES
  ('pending_orders', 'Pending Orders', '147', 'warning', 'down', '5% vs last week'),
  ('system_uptime', 'System Uptime', '99.9%', 'success', 'up', '0.05% vs last month'),
  ('new_registrations', 'New Registrations', '25', 'info', 'up', '12% vs last week'),
  ('support_tickets', 'Open Support Tickets', '7', 'danger', 'up', '2 (High Priority)');