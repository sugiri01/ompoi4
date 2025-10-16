-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('Buyer', 'Seller', 'QC Agent', 'Admin')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active', 'Locked', 'Pending', 'Suspended')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending QC' CHECK (status IN ('Pending QC', 'Approved', 'Rejected', 'Hold')),
  action_required TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_code TEXT UNIQUE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  buyer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Hold' CHECK (status IN ('Hold', 'Approved', 'Rejected')),
  action_required TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profile change requests table
CREATE TABLE public.profile_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create system status table
CREATE TABLE public.system_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Operational', 'Warning', 'Error')),
  message TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all for now - admin platform)
CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on profile_change_requests" ON public.profile_change_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on system_status" ON public.system_status FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profile_change_requests_updated_at BEFORE UPDATE ON public.profile_change_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.users (user_code, full_name, email, phone, role, status, last_login) VALUES
  ('U00128', 'John Doe', 'john.doe@example.com', '+1 555 0128', 'Seller', 'Active', now() - interval '5 minutes'),
  ('U00055', 'Jane Smith', 'jane.smith@example.com', '+1 555 0055', 'Buyer', 'Active', now() - interval '2 days'),
  ('U00340', 'Tech Tester', 'tech.tester@example.com', '+1 555 0340', 'QC Agent', 'Locked', now() - interval '10 days'),
  ('U00401', 'New User', 'new.user@example.com', '+1 555 0401', 'Buyer', 'Pending', NULL);

INSERT INTO public.orders (order_code, product_name, seller_name, status, action_required) VALUES
  ('ORD-9012', 'Cashew Lot 42', 'East Africa Traders', 'Pending QC', 'QC Report Approval');

INSERT INTO public.transactions (txn_code, amount, buyer_name, status, action_required) VALUES
  ('TXN-1002', 15000.00, 'Global Nuts Inc.', 'Hold', 'High Value Transaction Approval');

INSERT INTO public.profile_change_requests (report_code, change_type, status) VALUES
  ('RPT-0048', 'Name Change Verification', 'Pending');

INSERT INTO public.system_status (service_name, status, message) VALUES
  ('API Gateway', 'Operational', 'Latency: 50ms'),
  ('Database Server', 'Warning', 'High Load. CPU: 85%'),
  ('Logistics Partner Sync', 'Error', 'Connection failed 3 hours ago');