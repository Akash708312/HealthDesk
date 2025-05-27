
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  isUserAdmin,
  getPendingDoctors,
  getAllAppointments,
  getAllInitiatives,
  verifyDoctor as verifyDoctorService,
  updateAppointmentStatus as updateAppointmentStatusService,
  createAdminUser,
  deleteAdminUser,
  addDoctorNotification,
  Doctor,
  Appointment,
  Initiative
} from '@/services/adminService';
import { toast } from 'sonner';

export const useAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const adminStatus = await isUserAdmin(user.id);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadPendingDoctors = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const result = await getPendingDoctors();
      if (result.success && result.doctors) {
        setPendingDoctors(result.doctors);
      } else {
        toast.error(result.error || "Failed to load pending doctors");
      }
    } catch (error) {
      console.error("Error loading pending doctors:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadAllAppointments = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const result = await getAllAppointments();
      if (result.success && result.appointments) {
        setAllAppointments(result.appointments);
      } else {
        toast.error(result.error || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadInitiatives = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const result = await getAllInitiatives();
      if (result.success && result.initiatives) {
        setInitiatives(result.initiatives);
      } else {
        toast.error(result.error || "Failed to load initiatives");
      }
    } catch (error) {
      console.error("Error loading initiatives:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorVerification = async (doctorId: string, verified: boolean) => {
    setLoading(true);
    try {
      const result = await verifyDoctorService(doctorId, verified);
      if (result.success) {
        // Add notification for the doctor
        const message = verified 
          ? "Your doctor registration has been approved. You can now receive appointment requests."
          : "Your doctor registration has been rejected. Please contact support for more details.";
          
        await addDoctorNotification(doctorId, message);
        
        // Update local state by removing the doctor from pending list
        setPendingDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
        
        toast.success(`Doctor ${verified ? 'approved' : 'rejected'} successfully`);
      } else {
        toast.error(result.error || `Failed to ${verified ? 'approve' : 'reject'} doctor`);
      }
    } catch (error) {
      console.error(`Error ${verified ? 'approving' : 'rejecting'} doctor:`, error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentStatusUpdate = async (appointmentId: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const result = await updateAppointmentStatusService(appointmentId, status);
      if (result.success) {
        // Update the local state
        setAllAppointments(prev => 
          prev.map(appointment => 
            appointment.id === appointmentId 
              ? { ...appointment, status } 
              : appointment
          )
        );
        
        toast.success(`Appointment ${status} successfully`);
      } else {
        toast.error(result.error || `Failed to update appointment status`);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (userId: string) => {
    setLoading(true);
    try {
      const result = await createAdminUser(userId);
      if (result.success) {
        toast.success("Admin user created successfully");
        return true;
      } else {
        toast.error(result.error || "Failed to create admin user");
        return false;
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (userId: string) => {
    setLoading(true);
    try {
      const result = await deleteAdminUser(userId);
      if (result.success) {
        toast.success("Admin user removed successfully");
        return true;
      } else {
        toast.error(result.error || "Failed to remove admin user");
        return false;
      }
    } catch (error) {
      console.error("Error removing admin user:", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Load admin data when admin status changes
  useEffect(() => {
    if (isAdmin) {
      loadPendingDoctors();
      loadAllAppointments();
      loadInitiatives();
    }
  }, [isAdmin]);

  return {
    loading,
    isAdmin,
    pendingDoctors,
    allAppointments,
    initiatives,
    checkAdminStatus,
    loadPendingDoctors,
    loadAllAppointments,
    loadInitiatives,
    handleDoctorVerification,
    handleAppointmentStatusUpdate,
    handleCreateAdmin,
    handleDeleteAdmin
  };
};
