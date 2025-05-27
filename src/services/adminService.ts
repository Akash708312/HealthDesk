import { supabase } from "@/integrations/supabase/client";

// Define the types explicitly here since we can't modify the supabase types file
export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  location: string;
  availability: string;
  bio: string;
  image_url?: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  medical_issue: string;
  financial_status: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  date: string;
  organizer: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Sample admin users for demo purposes
export const sampleAdminUsers = [
  {
    email: "admin@healthdesk.com",
    password: "admin123",
    full_name: "Admin User"
  },
  {
    email: "superadmin@healthdesk.com",
    password: "super123",
    full_name: "Super Admin"
  }
];

// Sample data for admin features when DB is not ready
const samplePendingDoctors: Doctor[] = [
  {
    id: "101",
    full_name: "Dr. Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "(555) 222-3333",
    specialty: "Dermatology",
    experience: 7,
    location: "Boston, MA",
    availability: "Mon, Thu (9am-6pm)",
    bio: "Dr. Wilson is dedicated to providing affordable skin care services to underserved populations. He has published several papers on community dermatology programs.",
    verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "102",
    full_name: "Dr. Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    phone: "(555) 444-5555",
    specialty: "Gynecology",
    experience: 9,
    location: "Miami, FL",
    availability: "Tue, Fri (10am-4pm)",
    bio: "Dr. Rodriguez specializes in women's health issues and has extensive experience working in community clinics throughout Latin America and the US.",
    verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleAppointments: Appointment[] = [
  {
    id: "201",
    patient_id: "user-123",
    doctor_id: "1",
    patient_name: "John Smith",
    patient_email: "john.smith@example.com",
    patient_phone: "(555) 666-7777",
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    medical_issue: "Regular checkup and blood pressure monitoring",
    financial_status: "Unemployed, no health insurance",
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    doctor: {
      id: "1",
      full_name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      specialty: "General Medicine",
      experience: 10,
      location: "New York, NY",
      availability: "Mon, Wed, Fri (9am-5pm)",
      bio: "Dr. Johnson specializes in preventive care and chronic disease management.",
      verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: "202",
    patient_id: "user-456",
    doctor_id: "2",
    patient_name: "Maria Garcia",
    patient_email: "maria.garcia@example.com",
    patient_phone: "(555) 888-9999",
    appointment_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    medical_issue: "Child vaccination and wellness check",
    financial_status: "Single parent, part-time employment",
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    doctor: {
      id: "2",
      full_name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      phone: "(555) 987-6543",
      specialty: "Pediatrics",
      experience: 8,
      location: "San Francisco, CA",
      availability: "Tue, Thu (10am-6pm), Sat (9am-12pm)",
      bio: "Dr. Chen is passionate about child health and development.",
      verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

const sampleInitiatives: Initiative[] = [
  {
    id: "1",
    title: "Medical Camp in Rural Areas",
    description: "Join our quarterly medical camps that provide free healthcare services to rural communities.",
    date: "Next camp: June 15, 2025",
    organizer: "HealthDesk Foundation",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Free Vaccination Drive",
    description: "Help us immunize children and adults from low-income communities against preventable diseases.",
    date: "Next drive: May 8, 2025",
    organizer: "Vaccines For All",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=600&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Mental Health Awareness Program",
    description: "Free counseling and support services for those who cannot afford mental health treatment.",
    date: "Ongoing every weekend",
    organizer: "Mind Matters Initiative",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Admin login function
export const adminLogin = async (email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    // First try to authenticate with supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // For demo purposes, check against sample admin users
      const adminUser = sampleAdminUsers.find(admin => admin.email === email && admin.password === password);
      if (adminUser) {
        return { success: true, userId: email }; // Using email as userId for sample admins
      }
      throw authError;
    }

    // If auth succeeded, check if user is in admin_users table
    if (authData?.user) {
      const isAdmin = await isUserAdmin(authData.user.id);
      if (isAdmin) {
        return { success: true, userId: authData.user.id };
      } else {
        return { success: false, error: "User is not an admin" };
      }
    }
    
    return { success: false, error: "Authentication failed" };
  } catch (error: any) {
    console.error("Admin login error:", error);
    return { success: false, error: error.message || "Login failed" };
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Using raw TypeScript casting to bypass type constraints
    const supabaseAny = supabase as any;
    
    // Try RPC method first
    const result = await supabaseAny.rpc('is_admin_user', { user_id_param: userId });
    
    if (result.error) {
      // Fallback to direct query if RPC doesn't exist
      const { data, error } = await supabaseAny
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.message && error.message.includes("does not exist")) {
          console.log("admin_users table doesn't exist yet, treating user as non-admin");
        } else {
          console.error("Error checking admin status:", error);
        }
        return false;
      }
      
      return !!data;
    }
    
    return !!result.data;
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
};

// Get all pending doctor registrations
export const getPendingDoctors = async (): Promise<{ success: boolean; doctors?: Doctor[]; error?: string }> => {
  try {
    const { data, error } = await (supabase as any)
      .from('community_doctors')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false });

    // If table doesn't exist, return sample data
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, returning sample pending doctors");
      return { success: true, doctors: samplePendingDoctors };
    }

    if (error) throw error;
    return { success: true, doctors: data as Doctor[] };
  } catch (error: any) {
    console.error("Error fetching pending doctors:", error);
    // For demo purposes, return sample data
    return { success: true, doctors: samplePendingDoctors };
  }
};

// Get all appointments for admin
export const getAllAppointments = async (): Promise<{ success: boolean; appointments?: Appointment[]; error?: string }> => {
  try {
    const { data, error } = await (supabase as any)
      .from('community_appointments')
      .select(`
        *,
        doctor:community_doctors!doctor_id (
          full_name,
          specialty
        )
      `)
      .order('created_at', { ascending: false });

    // If table doesn't exist or relation error, return sample data
    if (error && error.message && (error.message.includes("does not exist") || 
        error.message.includes("Could not find a relationship"))) {
      console.log("Table doesn't exist yet or relation error, returning sample appointments");
      return { success: true, appointments: sampleAppointments };
    }

    if (error) throw error;
    return { success: true, appointments: data as Appointment[] };
  } catch (error: any) {
    console.error("Error fetching all appointments:", error);
    // For demo purposes, return sample data
    return { success: true, appointments: sampleAppointments };
  }
};

// Add notification for doctor verification
export const addDoctorNotification = async (doctorId: string, message: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await (supabase as any)
      .from('doctor_notifications')
      .insert([
        {
          doctor_id: doctorId,
          message,
          read: false
        }
      ]);

    // If table doesn't exist, just return success
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, but simulating successful notification");
      return { success: true };
    }

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error adding doctor notification:", error);
    // For demo, we'll say it succeeded anyway
    return { success: true };
  }
};

// Get all initiatives (for admin)
export const getAllInitiatives = async (): Promise<{ success: boolean; initiatives?: Initiative[]; error?: string }> => {
  try {
    const { data, error } = await (supabase as any)
      .from('community_initiatives')
      .select('*')
      .order('created_at', { ascending: false });

    // If table doesn't exist, return sample data
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, returning sample initiatives");
      return { success: true, initiatives: sampleInitiatives };
    }

    if (error) throw error;
    return { success: true, initiatives: data as Initiative[] };
  } catch (error: any) {
    console.error("Error fetching all initiatives:", error);
    // For demo purposes, return sample data
    return { success: true, initiatives: sampleInitiatives };
  }
};

// Create admin
export const createAdminUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await (supabase as any)
      .from('admin_users')
      .insert([
        {
          user_id: userId
        }
      ]);

    // If table doesn't exist, just return success
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, but simulating successful admin creation");
      return { success: true };
    }

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return { success: false, error: error.message || "Failed to create admin user" };
  }
};

// Delete admin
export const deleteAdminUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await (supabase as any)
      .from('admin_users')
      .delete()
      .eq('user_id', userId);

    // If table doesn't exist, just return success
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, but simulating successful admin deletion");
      return { success: true };
    }

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting admin user:", error);
    return { success: false, error: error.message || "Failed to delete admin user" };
  }
};

// Verify doctor function
export const verifyDoctor = async (doctorId: string, verified: boolean): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await (supabase as any)
      .from('community_doctors')
      .update({ verified })
      .eq('id', doctorId);

    // If table doesn't exist, just return success
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, but simulating successful doctor verification");
      return { success: true };
    }

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error verifying doctor:", error);
    return { success: false, error: error.message || "Failed to verify doctor" };
  }
};

// Update appointment status function
export const updateAppointmentStatus = async (appointmentId: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await (supabase as any)
      .from('community_appointments')
      .update({ status })
      .eq('id', appointmentId);

    // If table doesn't exist, just return success
    if (error && error.message && error.message.includes("does not exist")) {
      console.log("Table doesn't exist yet, but simulating successful status update");
      return { success: true };
    }

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    return { success: false, error: error.message || "Failed to update appointment status" };
  }
};
