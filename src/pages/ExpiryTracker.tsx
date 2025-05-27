
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { CalendarIcon, Loader2, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  expiry_date: string | null;
  notes: string | null;
}

const ExpiryTracker = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user]);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('expiry_date');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMedications(data);
      }
    } catch (error: any) {
      toast.error(`Failed to load medications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (medication: Medication) => {
    setEditingMedication(medication);
    setName(medication.name);
    setDosage(medication.dosage || '');
    setFrequency(medication.frequency || '');
    setExpiryDate(medication.expiry_date ? new Date(medication.expiry_date) : undefined);
    setNotes(medication.notes || '');
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMedication(null);
    setName('');
    setDosage('');
    setFrequency('');
    setExpiryDate(undefined);
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Medication name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingMedication) {
        // Update existing medication
        const { error } = await supabase
          .from('medications')
          .update({
            name,
            dosage: dosage || null,
            frequency: frequency || null,
            expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMedication.id);
        
        if (error) throw error;
        toast.success('Medication updated successfully');
      } else {
        // Add new medication
        const { error } = await supabase
          .from('medications')
          .insert({
            user_id: user?.id,
            name,
            dosage: dosage || null,
            frequency: frequency || null,
            expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
            notes: notes || null,
          });
        
        if (error) throw error;
        toast.success('Medication added successfully');
      }
      
      setDialogOpen(false);
      fetchMedications();
    } catch (error: any) {
      toast.error(`Operation failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      try {
        const { error } = await supabase
          .from('medications')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Medication deleted successfully');
        fetchMedications();
      } catch (error: any) {
        toast.error(`Delete failed: ${error.message}`);
      }
    }
  };

  const getExpiringSoon = () => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    
    return medications.filter(med => {
      if (!med.expiry_date) return false;
      const expiryDate = new Date(med.expiry_date);
      return isAfter(expiryDate, today) && isBefore(expiryDate, thirtyDaysFromNow);
    });
  };

  const getExpired = () => {
    const today = new Date();
    
    return medications.filter(med => {
      if (!med.expiry_date) return false;
      const expiryDate = new Date(med.expiry_date);
      return isBefore(expiryDate, today);
    });
  };

  const getActive = () => {
    const today = new Date();
    
    return medications.filter(med => {
      if (!med.expiry_date) return true; // No expiry date means it's still active
      const expiryDate = new Date(med.expiry_date);
      return isAfter(expiryDate, today);
    });
  };

  const renderMedicationCard = (medication: Medication) => {
    const isExpired = medication.expiry_date && isBefore(new Date(medication.expiry_date), new Date());
    const isExpiringSoon = 
      medication.expiry_date && 
      isAfter(new Date(medication.expiry_date), new Date()) && 
      isBefore(new Date(medication.expiry_date), addDays(new Date(), 30));
    
    return (
      <Card key={medication.id} className={isExpired ? "border-red-300" : isExpiringSoon ? "border-yellow-300" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{medication.name}</CardTitle>
              {medication.dosage && (
                <CardDescription>Dosage: {medication.dosage}</CardDescription>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(medication)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(medication.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {medication.frequency && (
            <p className="text-sm mb-2">Frequency: {medication.frequency}</p>
          )}
          {medication.expiry_date && (
            <div className="flex items-center mb-2">
              <p className="text-sm">
                Expires: {format(new Date(medication.expiry_date), 'PPP')}
              </p>
              {isExpired && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expired
                </span>
              )}
              {isExpiringSoon && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expiring Soon
                </span>
              )}
            </div>
          )}
          {medication.notes && (
            <p className="text-sm text-gray-500">{medication.notes}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Expiry Tracker</h1>
            <p className="text-muted-foreground">Track your medications and their expiry dates</p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Medications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/5 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : medications.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 p-3 rounded-full inline-flex mb-4">
                  <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No medications tracked yet</h3>
                <p className="text-gray-500 mb-4">Add your first medication to start tracking</p>
                <Button onClick={openAddDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map(renderMedicationCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/5 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : getActive().length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No active medications</h3>
                <p className="text-gray-500">Add medications to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getActive().map(renderMedicationCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="expiring-soon" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/5 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </CardContent>
                </Card>
              </div>
            ) : getExpiringSoon().length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No medications expiring soon</h3>
                <p className="text-gray-500">All your medications are good for at least 30 days</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getExpiringSoon().map(renderMedicationCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="expired" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/5 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </CardContent>
                </Card>
              </div>
            ) : getExpired().length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No expired medications</h3>
                <p className="text-gray-500">All your medications are still valid</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getExpired().map(renderMedicationCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMedication ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
            <DialogDescription>
              {editingMedication 
                ? 'Update your medication information below' 
                : 'Enter the details of your medication to track'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medication Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Amoxicillin"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g., Twice daily"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, 'PPP') : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information"
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
                    {editingMedication ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingMedication ? 'Update' : 'Add'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ExpiryTracker;
