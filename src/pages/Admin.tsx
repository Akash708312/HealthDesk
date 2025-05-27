
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Check, X, AlertCircle, Users, Calendar, UserPlus, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const navigate = useNavigate();
  const { 
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
    handleAppointmentStatusUpdate
  } = useAdmin();
  
  const { isAdminAuthenticated, checkAdminAuth, logoutAdmin } = useAdminAuth();

  useEffect(() => {
    const initialize = async () => {
      // First check if user is authenticated as admin
      if (!checkAdminAuth()) {
        navigate('/admin-login');
        return;
      }
      
      // Then check admin status in the database
      const isAdminUser = await checkAdminStatus();
      
      if (!isAdminUser) {
        // If using sample admin data, we'll still show the admin panel
        if (!isAdminAuthenticated) {
          navigate('/admin-login');
          return;
        }
      }
      
      await loadPendingDoctors();
      await loadAllAppointments();
      await loadInitiatives();
    };

    initialize();
  }, []);
  
  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login');
  };

  if (loading && !pendingDoctors.length && !allAppointments.length) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin && !isAdminAuthenticated) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access the admin area.</p>
          <Button onClick={() => navigate('/admin-login')}>Return to Admin Login</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/community')}>
              View Community Page
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending-doctors">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending-doctors" className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Pending Doctors</span>
              {pendingDoctors.length > 0 && (
                <Badge variant="secondary" className="ml-1">{pendingDoctors.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Appointments</span>
              {allAppointments.length > 0 && (
                <Badge variant="secondary" className="ml-1">{allAppointments.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="initiatives" className="flex items-center gap-2">
              <Users size={16} />
              <span>Initiatives</span>
              {initiatives.length > 0 && (
                <Badge variant="secondary" className="ml-1">{initiatives.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-doctors">
            <Card>
              <CardHeader>
                <CardTitle>Pending Doctor Verifications</CardTitle>
                <CardDescription>
                  Review and approve or reject doctor registration requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDoctors.length > 0 ? (
                  <div className="space-y-6">
                    {pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={doctor.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=6E59A5&color=fff`} />
                              <AvatarFallback>{doctor.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{doctor.full_name}</h3>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                              <Badge variant="outline" className="mt-1">{doctor.specialty}</Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="icon" 
                              variant="destructive"
                              onClick={() => handleDoctorVerification(doctor.id, false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="default"
                              onClick={() => handleDoctorVerification(doctor.id, true)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Phone:</span> {doctor.phone}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {doctor.experience} years
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {doctor.location}
                          </div>
                          <div>
                            <span className="font-medium">Availability:</span> {doctor.availability}
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Bio:</span>
                          <p className="mt-1 text-gray-600">{doctor.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Pending Requests</h3>
                    <p className="mt-1 text-gray-500">There are no pending doctor verification requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointment Requests</CardTitle>
                <CardDescription>
                  Review and manage appointment requests from patients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {allAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{appointment.patient_name}</h3>
                              <Badge variant={
                                appointment.status === 'approved' ? 'secondary' : 
                                appointment.status === 'rejected' ? 'destructive' : 
                                'outline'
                              }>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">{appointment.patient_email} | {appointment.patient_phone}</div>
                            <div className="flex items-center mt-1 text-sm">
                              <CalendarDays className="mr-1 h-4 w-4" />
                              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleAppointmentStatusUpdate(appointment.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleAppointmentStatusUpdate(appointment.id, 'approved')}
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <div className="mb-2">
                            <span className="font-medium text-sm">Doctor:</span>{' '}
                            <span className="text-sm">
                              {appointment.doctor?.full_name || 'Unknown'} ({appointment.doctor?.specialty || 'No specialty'})
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="font-medium text-sm">Medical Issue:</span>
                            <p className="text-sm text-gray-600 mt-1">{appointment.medical_issue}</p>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Financial Status:</span>
                            <p className="text-sm text-gray-600 mt-1">{appointment.financial_status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Appointments</h3>
                    <p className="mt-1 text-gray-500">There are no appointment requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="initiatives">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Healthcare Initiatives</CardTitle>
                  <CardDescription>
                    Manage community healthcare initiatives and events.
                  </CardDescription>
                </div>
                <Button>Add New Initiative</Button>
              </CardHeader>
              <CardContent>
                {initiatives.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {initiatives.map((initiative) => (
                      <Card key={initiative.id}>
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={initiative.image} 
                            alt={initiative.title}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>{initiative.title}</CardTitle>
                          <CardDescription>{initiative.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{initiative.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Initiatives</h3>
                    <p className="mt-1 text-gray-500">There are no healthcare initiatives yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;
