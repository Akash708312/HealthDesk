
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import PreventiveHealthTips from '../components/PreventiveHealthTips';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { format, addMonths, isAfter, isBefore, addDays } from 'date-fns';
import { CalendarIcon, Loader2, Plus, Edit, Trash2, Check, Clock, AlertCircle, Calendar as CalendarIcon2, Activity, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface HealthRecord {
  id: string;
  user_id: string;
  record_type: string;
  record_date: string;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface HealthScreening {
  id: string;
  name: string;
  description: string;
  recommendedAge: string;
  frequency: string;
  importance: 'Low' | 'Medium' | 'High';
  gender?: 'Male' | 'Female' | 'All';
}

// Extended profile interface to include gender
interface ExtendedProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  gender?: string;
}

const recordTypes = [
  'Annual Physical',
  'Dentist Checkup',
  'Eye Exam',
  'Blood Test',
  'Vaccination',
  'Mammogram',
  'Pap Smear',
  'Prostate Exam',
  'Colonoscopy',
  'Skin Cancer Screening',
  'Bone Density Test',
  'Cholesterol Test',
  'Blood Pressure Check',
  'Other'
];

const PreventiveHealthcare = () => {
  const { user, profile } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [activeTab, setActiveTab] = useState('checkups');
  const [healthScore, setHealthScore] = useState(78);

  // Form state
  const [recordType, setRecordType] = useState('');
  const [recordDate, setRecordDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Completed');

  // Recommended screenings data
  const recommendedScreenings: HealthScreening[] = [
    {
      id: '1',
      name: 'Blood Pressure Check',
      description: 'Regular blood pressure monitoring helps detect hypertension early, preventing heart disease and stroke.',
      recommendedAge: '18+',
      frequency: 'Annually or as recommended',
      importance: 'High'
    },
    {
      id: '2',
      name: 'Cholesterol Test',
      description: 'Measures various types of cholesterol in your blood to assess heart disease risk.',
      recommendedAge: '20+',
      frequency: 'Every 4-6 years (more frequently if at risk)',
      importance: 'Medium'
    },
    {
      id: '3',
      name: 'Colorectal Cancer Screening',
      description: 'Detects precancerous polyps and colorectal cancer early when treatment is most effective.',
      recommendedAge: '45-75',
      frequency: 'Varies by test type (1-10 years)',
      importance: 'High'
    },
    {
      id: '4',
      name: 'Mammogram',
      description: 'X-ray examination of breast tissue to detect early signs of breast cancer.',
      recommendedAge: '40+',
      frequency: 'Every 1-2 years',
      importance: 'High',
      gender: 'Female'
    },
    {
      id: '5',
      name: 'Pap Smear',
      description: 'Screens for cervical cancer by detecting abnormal cervical cells.',
      recommendedAge: '21-65',
      frequency: 'Every 3 years (or as recommended)',
      importance: 'High',
      gender: 'Female'
    },
    {
      id: '6',
      name: 'Prostate Cancer Screening',
      description: 'PSA blood test to screen for prostate cancer.',
      recommendedAge: '55-69',
      frequency: 'Discuss with doctor for personalized recommendation',
      importance: 'Medium',
      gender: 'Male'
    },
    {
      id: '7',
      name: 'Bone Density Test',
      description: 'Measures bone strength and assesses risk of fractures and osteoporosis.',
      recommendedAge: '65+ women, 70+ men',
      frequency: 'As recommended by doctor',
      importance: 'Medium'
    },
    {
      id: '8',
      name: 'Skin Cancer Screening',
      description: 'Visual examination of skin for suspicious moles or lesions.',
      recommendedAge: '20+',
      frequency: 'Monthly self-exam, professional exam as needed',
      importance: 'Medium'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .order('record_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setRecords(data);
      }
    } catch (error: any) {
      toast.error(`Failed to load records: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (record: HealthRecord) => {
    setEditingRecord(record);
    setRecordType(record.record_type);
    setRecordDate(record.record_date ? new Date(record.record_date) : undefined);
    setDescription(record.description || '');
    setStatus(record.status || 'Completed');
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingRecord(null);
    setRecordType('');
    setRecordDate(undefined);
    setDescription('');
    setStatus('Completed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recordType || !recordDate) {
      toast.error('Record type and date are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('health_records')
          .update({
            record_type: recordType,
            record_date: recordDate.toISOString(),
            description: description || null,
            status: status || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRecord.id);
        
        if (error) throw error;
        toast.success('Record updated successfully');
      } else {
        // Add new record
        const { error } = await supabase
          .from('health_records')
          .insert({
            user_id: user?.id,
            record_type: recordType,
            record_date: recordDate.toISOString(),
            description: description || null,
            status: status || null,
          });
        
        if (error) throw error;
        toast.success('Record added successfully');
      }
      
      setDialogOpen(false);
      fetchRecords();
    } catch (error: any) {
      toast.error(`Operation failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const { error } = await supabase
          .from('health_records')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Record deleted successfully');
        fetchRecords();
      } catch (error: any) {
        toast.error(`Delete failed: ${error.message}`);
      }
    }
  };

  const getUpcomingCheckups = () => {
    const today = new Date();
    
    return records.filter(record => {
      if (!record.record_date) return false;
      const recordDate = new Date(record.record_date);
      return isAfter(recordDate, today) && record.status === 'Scheduled';
    });
  };

  const getPastCheckups = () => {
    const today = new Date();
    
    return records.filter(record => {
      if (!record.record_date) return false;
      const recordDate = new Date(record.record_date);
      return isBefore(recordDate, today) || record.status === 'Completed';
    });
  };

  const getDueCheckups = () => {
    // Logic for determining due checkups based on standard preventive care guidelines
    const result = [];
    const today = new Date();
    
    // Check for annual physical if none in the past year
    const annualPhysical = records.find(record => 
      record.record_type === 'Annual Physical' && 
      isAfter(new Date(record.record_date), addMonths(today, -12))
    );
    
    if (!annualPhysical) {
      result.push({
        type: 'Annual Physical',
        dueDate: format(addDays(today, 30), 'PPP'),
        priority: 'High'
      });
    }
    
    // Check for dental checkup if none in the past 6 months
    const dentalCheckup = records.find(record => 
      record.record_type === 'Dentist Checkup' && 
      isAfter(new Date(record.record_date), addMonths(today, -6))
    );
    
    if (!dentalCheckup) {
      result.push({
        type: 'Dentist Checkup',
        dueDate: format(addDays(today, 14), 'PPP'),
        priority: 'Medium'
      });
    }
    
    // Check for eye exam if none in the past 2 years
    const eyeExam = records.find(record => 
      record.record_type === 'Eye Exam' && 
      isAfter(new Date(record.record_date), addMonths(today, -24))
    );
    
    if (!eyeExam) {
      result.push({
        type: 'Eye Exam',
        dueDate: format(addDays(today, 60), 'PPP'),
        priority: 'Medium'
      });
    }
    
    return result;
  };
  
  // Filter screenings based on user gender if available - Using optional chaining to safely access gender
  const filteredScreenings = profile?.gender 
    ? recommendedScreenings.filter(s => !s.gender || s.gender === profile.gender || s.gender === 'All')
    : recommendedScreenings;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Preventive Healthcare</h1>
            <p className="text-muted-foreground">Track and manage your preventive health screenings and check-ups</p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>

        {user && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Your Preventive Health Score
                </h2>
                <p className="text-sm text-muted-foreground mb-2">Based on your screening records and preventive care</p>
              </div>
              <div className="w-full md:w-1/3">
                <div className="flex items-center gap-4">
                  <Progress value={healthScore} className="h-3" />
                  <span className="font-semibold text-lg">{healthScore}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {healthScore >= 80 
                    ? 'Excellent preventive care!' 
                    : healthScore >= 60 
                    ? 'Good progress, a few more screenings recommended' 
                    : 'Several recommended screenings are due'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="checkups" className="flex items-center">
              <CalendarIcon2 className="h-4 w-4 mr-2" /> Checkup Tracker
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" /> Recommended Screenings
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" /> Preventive Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkups" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Due Checkups Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    Due Checkups
                  </CardTitle>
                  <CardDescription>
                    Preventive care measures you should schedule soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getDueCheckups().length === 0 ? (
                    <div className="text-center py-6">
                      <Check className="h-10 w-10 mx-auto text-green-500 mb-2" />
                      <p className="text-gray-500">Great job! You're up to date on your preventive care.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {getDueCheckups().map((checkup, index) => (
                        <li key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium">{checkup.type}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              checkup.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {checkup.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Due by: {checkup.dueDate}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs h-7"
                            onClick={() => {
                              setRecordType(checkup.type);
                              setDialogOpen(true);
                            }}
                          >
                            Schedule
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Checkups Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Upcoming Checkups
                  </CardTitle>
                  <CardDescription>
                    Your scheduled health appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                      <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                    </div>
                  ) : getUpcomingCheckups().length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No upcoming appointments scheduled.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={openAddDialog}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Checkup
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {getUpcomingCheckups().map(record => (
                        <li key={record.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{record.record_type}</h4>
                              <p className="text-sm text-gray-600">
                                {format(new Date(record.record_date), 'PPP')}
                              </p>
                              {record.description && (
                                <p className="text-xs text-gray-500 mt-1">{record.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(record)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(record.id)}>
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Past Checkups Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    Past Checkups
                  </CardTitle>
                  <CardDescription>
                    Your completed health appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                      <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                    </div>
                  ) : getPastCheckups().length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No past appointments recorded.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={openAddDialog}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Past Checkup
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {getPastCheckups().slice(0, 5).map(record => (
                        <li key={record.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{record.record_type}</h4>
                              <p className="text-sm text-gray-600">
                                {format(new Date(record.record_date), 'PPP')}
                              </p>
                              {record.description && (
                                <p className="text-xs text-gray-500 mt-1">{record.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(record)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(record.id)}>
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                      {getPastCheckups().length > 5 && (
                        <Button variant="ghost" className="w-full text-sm" onClick={() => toast.info('View all records feature coming soon')}>
                          View all {getPastCheckups().length} records
                        </Button>
                      )}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Health Record History</CardTitle>
                <CardDescription>
                  View all your health records in chronological order
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-100 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 p-3 rounded-full inline-flex mb-4">
                      <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-1">No health records</h3>
                    <p className="text-gray-500 mb-4">Add your first health record to start tracking</p>
                    <Button onClick={openAddDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Health Record
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Type</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Description</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {records.map(record => (
                          <tr key={record.id}>
                            <td className="py-3 px-4">{record.record_type}</td>
                            <td className="py-3 px-4">{format(new Date(record.record_date), 'PPP')}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                record.status === 'Completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : record.status === 'Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {record.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate">{record.description || '-'}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(record)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Health Screenings</CardTitle>
                <CardDescription>Evidence-based screenings by age and risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredScreenings.map(screening => (
                    <div key={screening.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{screening.name}</h3>
                            <Badge variant="outline" className={
                              screening.importance === 'High' 
                                ? 'bg-red-50 text-red-800 border-red-200' 
                                : screening.importance === 'Medium'
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }>
                              {screening.importance} Priority
                            </Badge>
                            {screening.gender && screening.gender !== 'All' && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                                {screening.gender} Only
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{screening.description}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                            <div className="flex items-center text-sm">
                              <span className="font-medium text-muted-foreground mr-1">Age:</span>
                              <span>{screening.recommendedAge}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="font-medium text-muted-foreground mr-1">Frequency:</span>
                              <span>{screening.frequency}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setRecordType(screening.name);
                            setDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  <AlertCircle className="inline-block h-3 w-3 mr-1" />
                  These recommendations are general guidelines. Please consult with your healthcare provider for personalized advice.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <PreventiveHealthTips />
            
            <Card>
              <CardHeader>
                <CardTitle>Personalized Preventive Plan</CardTitle>
                <CardDescription>
                  Get a customized prevention plan based on your health profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-28 flex-col">
                        <CalendarIcon2 className="h-6 w-6 mb-3" />
                        <span>Screening Calendar</span>
                        <span className="text-xs text-muted-foreground">View your annual plan</span>
                      </Button>
                      <Button variant="outline" className="h-28 flex-col">
                        <Activity className="h-6 w-6 mb-3" />
                        <span>Risk Assessment</span>
                        <span className="text-xs text-muted-foreground">Calculate your health risks</span>
                      </Button>
                      <Button variant="outline" className="h-28 flex-col">
                        <Heart className="h-6 w-6 mb-3" />
                        <span>Generate Health Plan</span>
                        <span className="text-xs text-muted-foreground">Personalized recommendations</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sign in for a personalized plan</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Create an account or sign in to get personalized preventive healthcare recommendations based on your health profile and risk factors.
                    </p>
                    <div className="flex justify-center gap-3">
                      <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                        Login
                      </a>
                      <a href="/signup" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md text-sm">
                        Sign Up
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Health Record' : 'Add Health Record'}</DialogTitle>
            <DialogDescription>
              {editingRecord 
                ? 'Update your health record information' 
                : 'Enter the details of your health check-up or screening'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="record-type">Record Type*</Label>
                <Select 
                  value={recordType} 
                  onValueChange={setRecordType}
                  required
                >
                  <SelectTrigger id="record-type">
                    <SelectValue placeholder="Select type of health record" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="record-date">Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="record-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recordDate ? format(recordDate, 'PPP') : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={recordDate}
                      onSelect={setRecordDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Notes</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional information or results"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingRecord ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingRecord ? 'Update' : 'Add'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PreventiveHealthcare;
