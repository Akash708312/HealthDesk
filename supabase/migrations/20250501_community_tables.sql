
-- Create community doctors table
CREATE TABLE IF NOT EXISTS public.community_doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience INTEGER NOT NULL,
  location TEXT NOT NULL,
  availability TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create community appointments table
CREATE TABLE IF NOT EXISTS public.community_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.community_doctors(id),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  medical_issue TEXT NOT NULL,
  financial_status TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES public.community_doctors(id)
);

-- Create doctor notifications table
CREATE TABLE IF NOT EXISTS public.doctor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES public.community_doctors(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create community initiatives table
CREATE TABLE IF NOT EXISTS public.community_initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  organizer TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert sample initiatives data
INSERT INTO public.community_initiatives (id, title, description, date, organizer, image)
VALUES 
  ('1', 'Medical Camp in Rural Areas', 'Join our quarterly medical camps that provide free healthcare services to rural communities.', 'Next camp: June 15, 2025', 'HealthDesk Foundation', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'),
  ('2', 'Free Vaccination Drive', 'Help us immunize children and adults from low-income communities against preventable diseases.', 'Next drive: May 8, 2025', 'Vaccines For All', 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=600&auto=format&fit=crop'),
  ('3', 'Mental Health Awareness Program', 'Free counseling and support services for those who cannot afford mental health treatment.', 'Ongoing every weekend', 'Mind Matters Initiative', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop');

-- Add RLS policies
ALTER TABLE public.community_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies for community doctors
CREATE POLICY "Public users can view verified doctors" 
ON public.community_doctors FOR SELECT 
USING (verified = true);

CREATE POLICY "Admins can view all doctors" 
ON public.community_doctors FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create policies for community appointments
CREATE POLICY "Users can view their own appointments" 
ON public.community_appointments FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Users can create appointments" 
ON public.community_appointments FOR INSERT 
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view appointments for themselves" 
ON public.community_appointments FOR SELECT 
USING (doctor_id IN (SELECT id FROM public.community_doctors WHERE email = auth.email()));

CREATE POLICY "Admins can view all appointments" 
ON public.community_appointments FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create policies for doctor notifications
CREATE POLICY "Doctors can view their own notifications" 
ON public.doctor_notifications FOR SELECT 
USING (doctor_id IN (SELECT id FROM public.community_doctors WHERE email = auth.email()));

CREATE POLICY "Admins can manage notifications" 
ON public.doctor_notifications FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create policies for admin users
CREATE POLICY "Admins can view admin users" 
ON public.admin_users FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Create policies for community initiatives
CREATE POLICY "Anyone can view initiatives" 
ON public.community_initiatives FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage initiatives" 
ON public.community_initiatives FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
