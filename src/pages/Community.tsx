
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Calendar, 
  UserPlus, 
  CalendarDays, 
  Heart, 
  User, 
  MessageSquare, 
  Hospital, 
  Users, 
  BriefcaseMedical,
  Phone,
  Mail,
  MapPin,
  Clock,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/hooks/useCommunity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DoctorProfileModal from '@/components/DoctorProfileModal';
import VolunteerForm from '@/components/VolunteerForm';

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    isLoading,
    doctors,
    appointments,
    initiatives,
    handleDoctorRegistration,
    handleAppointmentBooking,
    loadInitiatives
  } = useCommunity();
  const [activeTab, setActiveTab] = useState("find-doctor");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDoctorProfileOpen, setIsDoctorProfileOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<string>("");
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

  // Doctor registration form schema
  const doctorFormSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    specialty: z.string().min(2, { message: "Please select a specialty." }),
    experience: z.string().min(1, { message: "Please enter your years of experience." }),
    location: z.string().min(2, { message: "Please enter your location." }),
    availability: z.string().min(2, { message: "Please enter your availability." }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters." })
  });

  // Patient appointment form schema
  const appointmentFormSchema = z.object({
    patientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    patientEmail: z.string().email({ message: "Please enter a valid email." }),
    patientPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    doctorId: z.string().min(1, { message: "Please select a doctor." }),
    appointmentDate: z.string().min(1, { message: "Please select a date." }),
    medicalIssue: z.string().min(10, { message: "Please describe your medical issue (min 10 characters)." }),
    financialStatus: z.string().min(2, { message: "Please describe your financial situation." })
  });

  // Doctor registration form
  const doctorForm = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: "",
      specialty: "",
      experience: "",
      location: "",
      availability: "",
      bio: ""
    }
  });

  // Patient appointment form
  const appointmentForm = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: user?.user_metadata?.full_name || "",
      patientEmail: user?.email || "",
      patientPhone: "",
      doctorId: selectedDoctorId || "",
      appointmentDate: "",
      medicalIssue: "",
      financialStatus: ""
    }
  });

  // Update appointment form when selected doctor changes
  React.useEffect(() => {
    if (selectedDoctorId) {
      appointmentForm.setValue("doctorId", selectedDoctorId);
    }
  }, [selectedDoctorId, appointmentForm]);

  // Handle doctor registration
  const onDoctorSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to register as a doctor");
      return;
    }

    try {
      const success = await handleDoctorRegistration(data);
      if (success) {
        doctorForm.reset();
        toast.success("Your registration has been submitted for verification. We will contact you soon.");
        setActiveTab("find-doctor");
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      toast.error("Registration failed. Please try again later.");
    }
  };

  // Handle patient appointment
  const onAppointmentSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to book an appointment");
      return;
    }

    try {
      const success = await handleAppointmentBooking(data);
      if (success) {
        appointmentForm.reset();
        setActiveTab("find-doctor");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Booking failed. Please try again later.");
    }
  };

  // Handle view doctor profile
  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorProfileOpen(true);
  };

  // Handle book appointment from doctor card
  const handleBookAppointment = (doctor) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book an appointment");
      return;
    }
    setSelectedDoctorId(doctor.id);
    setActiveTab("book-appointment");
  };

  // Handle book appointment from doctor profile
  const handleBookFromProfile = () => {
    if (selectedDoctor) {
      setSelectedDoctorId(selectedDoctor.id);
      setIsDoctorProfileOpen(false);
      setActiveTab("book-appointment");
    }
  };

  // Handle volunteer button click
  const handleVolunteerClick = (initiativeId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to volunteer");
      return;
    }
    setSelectedInitiative(initiativeId);
    setShowVolunteerForm(true);
  };

  // Loading states for doctors
  const DoctorSkeleton = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  // Find initiative by id
  const getInitiativeTitle = (id: string) => {
    const initiative = initiatives.find(i => i.id === id);
    return initiative ? initiative.title : "";
  };

  return (
    <PageLayout>
      <SEO 
        title="Community Healthcare | WRLDS Health" 
        description="Connect with doctors offering charitable services and join our healthcare initiatives for the underserved communities" 
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">Healthcare Community</h1>
          <p className="text-xl text-gray-600 mt-2 max-w-3xl mx-auto">
            Connecting compassionate healthcare providers with patients in need through charitable services
          </p>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="find-doctor" className="flex items-center gap-2">
              <BriefcaseMedical className="h-5 w-5" />
              <span className="hidden sm:inline">Find Doctors</span>
            </TabsTrigger>
            <TabsTrigger value="book-appointment" className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <span className="hidden sm:inline">Book Appointment</span>
            </TabsTrigger>
            <TabsTrigger value="doctor-registration" className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span className="hidden sm:inline">Register as Doctor</span>
            </TabsTrigger>
            <TabsTrigger value="initiatives" className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span className="hidden sm:inline">Initiatives</span>
            </TabsTrigger>
          </TabsList>

          {/* Find Doctors Tab */}
          <TabsContent value="find-doctor">
            {!isAuthenticated && (
              <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-300">
                <AlertTitle>Please note</AlertTitle>
                <AlertDescription>
                  You need to be logged in to book appointments with our volunteer doctors.
                </AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <DoctorSkeleton key={i} />
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4 bg-gradient-to-r from-primary-50 to-primary-100">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <CardTitle className="text-primary-800">{doctor.full_name}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="bg-primary-200 text-primary-800 border-primary-300">
                              {doctor.specialty}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-white border-2 border-primary-200">
                          <img 
                            src={doctor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=6E59A5&color=fff`} 
                            alt={doctor.full_name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-primary-600" />
                          <span><strong>Experience:</strong> {doctor.experience} years</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                          <span><strong>Location:</strong> {doctor.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary-600" />
                          <span><strong>Availability:</strong> {doctor.availability}</span>
                        </div>
                        <p className="mt-4 text-gray-700 line-clamp-3">{doctor.bio}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => handleViewProfile(doctor)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        Book Appointment
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Hospital className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No Verified Doctors Available</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  There are currently no verified doctors available in our system.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Book Appointment Tab */}
          <TabsContent value="book-appointment">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Login Required</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  You need to be logged in to book an appointment with our volunteer doctors.
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                  Login to Continue
                </Button>
              </div>
            ) : (
              <Card className="border-primary-200">
                <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
                  <CardTitle className="text-primary-800">Request a Charitable Appointment</CardTitle>
                  <CardDescription>
                    Fill out this form to request an appointment with one of our volunteer doctors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...appointmentForm}>
                    <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={appointmentForm.control}
                          name="patientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={appointmentForm.control}
                          name="patientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={appointmentForm.control}
                          name="patientPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={appointmentForm.control}
                          name="doctorId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Doctor</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {doctors.map((doctor) => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                      {doctor.full_name} - {doctor.specialty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={appointmentForm.control}
                          name="appointmentDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={appointmentForm.control}
                        name="medicalIssue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Issue</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your medical issue in detail..." 
                                className="min-h-[100px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appointmentForm.control}
                        name="financialStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Financial Situation</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please briefly describe your financial situation to help us understand your need for charitable care..." 
                                className="min-h-[100px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This information helps us prioritize cases based on need. All information is kept confidential.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("find-doctor")}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700">
                          {isLoading ? "Submitting..." : "Submit Request"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {appointments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Your Appointment Requests</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border-l-4 border-l-primary-400">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{appointment.doctor?.full_name || "Doctor"}</CardTitle>
                          <Badge 
                            variant={
                              appointment.status === 'approved' ? "secondary" : 
                              appointment.status === 'rejected' ? "destructive" : "outline"
                            }
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {appointment.doctor?.specialty || "Healthcare Professional"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <ClipboardList className="h-4 w-4 mr-2 text-primary-600" />
                            <span className="line-clamp-1">{appointment.medical_issue}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Doctor Registration Tab */}
          <TabsContent value="doctor-registration">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Login Required</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  You need to be logged in to register as a volunteer doctor.
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                  Login to Continue
                </Button>
              </div>
            ) : (
              <Card className="border-primary-200">
                <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
                  <CardTitle className="text-primary-800">Register as a Volunteer Doctor</CardTitle>
                  <CardDescription>
                    Thank you for your interest in providing charitable healthcare services. Please fill out this form to register.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...doctorForm}>
                    <form onSubmit={doctorForm.handleSubmit(onDoctorSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={doctorForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="doctor@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="specialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medical Specialty</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your specialty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                  <SelectItem value="Gynecology">Gynecology</SelectItem>
                                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                                  <SelectItem value="ENT">ENT</SelectItem>
                                  <SelectItem value="Neurology">Neurology</SelectItem>
                                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                  <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorForm.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., Mon & Wed afternoons" {...field} />
                              </FormControl>
                              <FormDescription>
                                Please specify days/times you're available for charitable work
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={doctorForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share your background, expertise, and motivation for volunteering..." 
                                className="min-h-[100px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {isLoading ? "Submitting..." : "Register as Volunteer Doctor"}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-md mt-4">
                        <p className="font-medium mb-2">Registration Process:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Submit your registration details</li>
                          <li>Our admin team will verify your medical credentials</li>
                          <li>Upon approval, your profile will be visible to patients seeking care</li>
                          <li>You'll receive appointment requests matching your availability</li>
                        </ol>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Initiatives Tab */}
          <TabsContent value="initiatives">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-10 w-28" />
                      <Skeleton className="h-10 w-28" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initiatives.map((initiative) => (
                  <Card key={initiative.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={initiative.image} 
                        alt={initiative.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-primary-800">{initiative.title}</CardTitle>
                      <CardDescription>{initiative.organizer}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{initiative.description}</p>
                      <p className="text-primary-600 font-medium mt-4">{initiative.date}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Learn More</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{initiative.title}</DialogTitle>
                            <DialogDescription>{initiative.organizer}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="rounded-md overflow-hidden h-48">
                              <img 
                                src={initiative.image} 
                                alt={initiative.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="font-medium text-primary-600">{initiative.date}</p>
                              <p className="text-gray-700">{initiative.description}</p>
                              <p className="text-gray-700 mt-2">
                                Join us in making quality healthcare accessible to everyone. This initiative aims to reach underserved communities and provide essential medical services to those in need.
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        className="bg-primary-600 hover:bg-primary-700"
                        onClick={() => handleVolunteerClick(initiative.id)}
                      >
                        Volunteer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary-800">How You Can Help</h3>
                <p className="text-gray-600">Join our community of healthcare volunteers making a difference</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary-100 rounded-full">
                        <Users className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-primary-700">Volunteer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Offer your time and skills to support our healthcare initiatives for the underserved.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary-100 rounded-full">
                        <Heart className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-primary-700">Donate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Contribute funds to help expand our reach and provide essential medical supplies.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary-100 rounded-full">
                        <MessageSquare className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-primary-700">Spread Awareness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Help us reach more people by sharing information about our charitable healthcare services.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  size="lg" 
                  className="px-8 bg-primary-600 hover:bg-primary-700"
                  onClick={() => setActiveTab("doctor-registration")}
                >
                  Get Involved Today
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal 
        doctor={selectedDoctor}
        open={isDoctorProfileOpen}
        onClose={() => setIsDoctorProfileOpen(false)}
        onBookAppointment={handleBookFromProfile}
      />

      {/* Volunteer Form Modal */}
      <Dialog open={showVolunteerForm} onOpenChange={setShowVolunteerForm}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Volunteer Application</DialogTitle>
            <DialogDescription>
              Thank you for your interest in volunteering for "{getInitiativeTitle(selectedInitiative)}"
            </DialogDescription>
          </DialogHeader>
          <VolunteerForm 
            initiativeId={selectedInitiative} 
            initiativeTitle={getInitiativeTitle(selectedInitiative)}
            onSuccess={() => setShowVolunteerForm(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Community;
