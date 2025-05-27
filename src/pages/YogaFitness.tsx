
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Edit, Trash2, Calendar, Clock, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface YogaSession {
  id: string;
  user_id: string;
  session_name: string;
  duration: number;
  calories_burned: number | null;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const yogaSessionTypes = [
  'Vinyasa Flow',
  'Hatha Yoga',
  'Ashtanga',
  'Power Yoga',
  'Yin Yoga',
  'Restorative Yoga',
  'Kundalini Yoga',
  'Morning Stretch',
  'Evening Relaxation',
  'Cardio Workout',
  'Strength Training',
  'Core Workout',
  'High-Intensity Interval Training',
  'Walking',
  'Running',
  'Cycling',
  'Swimming',
  'Pilates',
  'Meditation'
];

const YogaFitness = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSession, setEditingSession] = useState<YogaSession | null>(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageDuration: 0,
  });

  // Form state
  const [sessionName, setSessionName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    // Calculate stats
    if (sessions.length > 0) {
      const totalSessions = sessions.length;
      const totalDuration = sessions.reduce((total, session) => total + session.duration, 0);
      const totalCalories = sessions.reduce((total, session) => total + (session.calories_burned || 0), 0);
      const averageDuration = totalDuration / totalSessions;

      setStats({
        totalSessions,
        totalDuration,
        totalCalories,
        averageDuration,
      });
    }
  }, [sessions]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('yoga_sessions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setSessions(data);
      }
    } catch (error: any) {
      toast.error(`Failed to load sessions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (session: YogaSession) => {
    setEditingSession(session);
    setSessionName(session.session_name);
    setDuration(session.duration.toString());
    setCaloriesBurned(session.calories_burned?.toString() || '');
    setNotes(session.notes || '');
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSession(null);
    setSessionName('');
    setDuration('');
    setCaloriesBurned('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName || !duration) {
      toast.error('Session name and duration are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const durationNum = parseInt(duration);
      const caloriesNum = caloriesBurned ? parseInt(caloriesBurned) : null;
      
      if (isNaN(durationNum) || durationNum <= 0) {
        toast.error('Duration must be a positive number');
        setIsSubmitting(false);
        return;
      }
      
      if (caloriesBurned && (isNaN(Number(caloriesBurned)) || Number(caloriesBurned) < 0)) {
        toast.error('Calories must be a positive number');
        setIsSubmitting(false);
        return;
      }
      
      if (editingSession) {
        // Update existing session
        const { error } = await supabase
          .from('yoga_sessions')
          .update({
            session_name: sessionName,
            duration: durationNum,
            calories_burned: caloriesNum,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSession.id);
        
        if (error) throw error;
        toast.success('Session updated successfully');
      } else {
        // Add new session
        const { error } = await supabase
          .from('yoga_sessions')
          .insert({
            user_id: user?.id,
            session_name: sessionName,
            duration: durationNum,
            calories_burned: caloriesNum,
            date: new Date().toISOString(),
            notes: notes || null,
          });
        
        if (error) throw error;
        toast.success('Session added successfully');
      }
      
      setDialogOpen(false);
      fetchSessions();
    } catch (error: any) {
      toast.error(`Operation failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        const { error } = await supabase
          .from('yoga_sessions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Session deleted successfully');
        fetchSessions();
      } catch (error: any) {
        toast.error(`Delete failed: ${error.message}`);
      }
    }
  };

  return (
    <MainLayout showSidebar={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Yoga & Fitness</h1>
            <p className="text-muted-foreground">Track your yoga and fitness activities</p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>

        {/* Stats Cards */}
        {!isLoading && sessions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Sessions</CardDescription>
                <CardTitle className="text-2xl">{stats.totalSessions}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Duration</CardDescription>
                <CardTitle className="text-2xl">{stats.totalDuration} minutes</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Duration</CardDescription>
                <CardTitle className="text-2xl">{Math.round(stats.averageDuration)} minutes</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Calories Burned</CardDescription>
                <CardTitle className="text-2xl">{stats.totalCalories} kcal</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Sessions list */}
        <h2 className="text-xl font-semibold mb-4">Your Sessions</h2>
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="bg-white p-3 rounded-full inline-flex mb-4 shadow-sm">
              <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">No sessions recorded yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your yoga and fitness activities</p>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Session
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{session.session_name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(session)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(session.date), 'PPP')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {session.duration} minutes
                      </span>
                    </div>
                    {session.calories_burned && (
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {session.calories_burned} calories
                        </span>
                      </div>
                    )}
                  </div>
                  {session.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      {session.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSession ? 'Edit Session' : 'Add Session'}</DialogTitle>
            <DialogDescription>
              {editingSession 
                ? 'Update your fitness session details below' 
                : 'Record your yoga or fitness activity'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sessionName">Session Type*</Label>
                <Select 
                  value={sessionName} 
                  onValueChange={setSessionName}
                  required
                >
                  <SelectTrigger id="sessionName">
                    <SelectValue placeholder="Select a session type" />
                  </SelectTrigger>
                  <SelectContent>
                    {yogaSessionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)*</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 30"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calories">Calories Burned</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    placeholder="e.g., 150"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information about your session"
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
                    {editingSession ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingSession ? 'Update' : 'Add'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default YogaFitness;
