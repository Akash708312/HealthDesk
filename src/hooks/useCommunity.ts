
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  registerDoctor, 
  bookAppointment, 
  getVerifiedDoctors, 
  getPatientAppointments,
  getInitiatives,
  Doctor,
  Appointment,
  Initiative
} from '@/services/communityService';
import { toast } from 'sonner';

export const useCommunity = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  // Load doctors
  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const result = await getVerifiedDoctors();
      if (result.success && result.doctors) {
        setDoctors(result.doctors);
      } else {
        toast.error(result.error || "Failed to load doctors");
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast.error("An unexpected error occurred while loading doctors");
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new doctor
  const handleDoctorRegistration = async (doctorData: any) => {
    setIsLoading(true);
    try {
      const result = await registerDoctor({
        full_name: doctorData.fullName,
        email: doctorData.email,
        phone: doctorData.phone,
        specialty: doctorData.specialty,
        experience: parseInt(doctorData.experience),
        location: doctorData.location,
        availability: doctorData.availability,
        bio: doctorData.bio,
      });

      if (result.success) {
        toast.success("Your registration has been submitted for verification. We will contact you soon.");
        return true;
      } else {
        toast.error(result.error || "Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      toast.error("An unexpected error occurred during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Book an appointment with a doctor
  const handleAppointmentBooking = async (appointmentData: any) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to book an appointment");
      return false;
    }

    setIsLoading(true);
    try {
      const result = await bookAppointment({
        patient_id: user.id,
        doctor_id: appointmentData.doctorId,
        patient_name: appointmentData.patientName,
        patient_email: appointmentData.patientEmail,
        patient_phone: appointmentData.patientPhone,
        appointment_date: appointmentData.appointmentDate,
        medical_issue: appointmentData.medicalIssue,
        financial_status: appointmentData.financialStatus,
      });

      if (result.success) {
        toast.success("Your appointment request has been submitted successfully");
        return true;
      } else {
        toast.error(result.error || "Failed to book appointment");
        return false;
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("An unexpected error occurred while booking your appointment");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load patient's appointments
  const loadPatientAppointments = async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const result = await getPatientAppointments(user.id);
      if (result.success && result.appointments) {
        setAppointments(result.appointments);
      }
    } catch (error) {
      console.error("Error loading patient appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initiatives
  const loadInitiatives = async () => {
    setIsLoading(true);
    try {
      const result = await getInitiatives();
      if (result.success && result.initiatives) {
        setInitiatives(result.initiatives);
      }
    } catch (error) {
      console.error("Error loading initiatives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDoctors();
    loadInitiatives();
    if (isAuthenticated && user) {
      loadPatientAppointments();
    }
  }, [isAuthenticated, user]);

  return {
    isLoading,
    doctors,
    appointments,
    initiatives,
    handleDoctorRegistration,
    handleAppointmentBooking,
    loadDoctors,
    loadPatientAppointments,
    loadInitiatives
  };
};
