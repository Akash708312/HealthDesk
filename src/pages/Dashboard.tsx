
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import SEO from '../components/SEO';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { PlusCircle, Calendar } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import DashboardCharts from '../components/DashboardCharts';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import AddHealthData from '../components/AddHealthData';

interface HealthData {
  vitals: any[];
  bodyMeasurements: any[];
  labResults: any[];
  dietPlans: any[];
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showAddData, setShowAddData] = useState(false);
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>({
    vitals: [],
    bodyMeasurements: [],
    labResults: [],
    dietPlans: []
  });
  
  const [recentActivities, setRecentActivities] = useState([
    {
      id: "1",
      type: "health_record",
      description: "Updated blood pressure reading",
      date: new Date().toISOString(),
      status: "completed"
    },
    {
      id: "2",
      type: "appointment",
      description: "Doctor appointment scheduled",
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "pending"
    },
    {
      id: "3",
      type: "medication",
      description: "Medication reminder: Vitamin D",
      date: new Date(Date.now() - 172800000).toISOString(),
      status: "missed"
    }
  ]);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        toast.error("Please log in to view your health data");
        setLoading(false);
        return;
      }
      
      // Fetch health records
      const { data: records, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });
        
      if (error) {
        console.error("Error fetching health records:", error);
        toast.error("Failed to load health data");
        setLoading(false);
        return;
      }
      
      // Process health records by type
      const processedData: HealthData = {
        vitals: [],
        bodyMeasurements: [],
        labResults: [],
        dietPlans: []
      };
      
      if (records) {
        records.forEach((record: any) => {
          try {
            const parsedDescription = JSON.parse(record.description);
            const recordWithData = {
              ...record,
              data: parsedDescription
            };
            
            switch (record.record_type) {
              case 'vitals':
                processedData.vitals.push(recordWithData);
                break;
              case 'body_measurements':
                processedData.bodyMeasurements.push(recordWithData);
                break;
              case 'lab_results':
                processedData.labResults.push(recordWithData);
                break;
              case 'diet_plan':
                processedData.dietPlans.push(recordWithData);
                break;
              default:
                break;
            }
          } catch (err) {
            console.error("Error parsing record description:", err);
          }
        });
      }
      
      setHealthData(processedData);
      
      // Generate recent activities based on records
      if (records && records.length > 0) {
        const activities = records.slice(0, 5).map((record: any) => {
          let description = "Updated health record";
          let type = "health_record";
          
          switch (record.record_type) {
            case 'vitals':
              description = "Updated vital signs";
              break;
            case 'body_measurements':
              description = "Updated body measurements";
              break;
            case 'lab_results':
              description = "Added lab test results";
              break;
            case 'diet_plan':
              description = "Created diet plan";
              type = "nutrition";
              break;
          }
          
          return {
            id: record.id,
            type,
            description,
            date: record.created_at,
            status: "completed"
          };
        });
        
        setRecentActivities(activities);
      }
      
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDataToggle = () => {
    setShowAddData(!showAddData);
  };

  const handleDataAdded = () => {
    fetchHealthData();
    setShowAddData(false);
    toast.success("Health data added successfully!");
  };

  const renderWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = "Good morning";
    
    if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    } else if (hour >= 17) {
      greeting = "Good evening";
    }
    
    return `${greeting}, ${user?.user_metadata?.full_name || 'there'}!`;
  };

  return (
    <MainLayout>
      <SEO 
        title="Health Dashboard | HealthDesk" 
        description="Monitor your health metrics and track your progress" 
      />
      <div className="space-y-6">
        {/* Welcome & Date Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{renderWelcomeMessage()}</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <Button onClick={handleAddDataToggle} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> 
            {showAddData ? "Hide Form" : "Add Health Data"}
          </Button>
        </div>

        {/* Add Health Data Form */}
        {showAddData && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Add New Health Data</CardTitle>
              <CardDescription>Record your latest health measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <AddHealthData onSuccess={handleDataAdded} />
            </CardContent>
          </Card>
        )}
        
        {/* Stats Overview */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Health Overview</h2>
          <DashboardStats vitals={healthData.vitals} />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Health Data Charts */}
        <div className="grid grid-cols-1 gap-6">
          <DashboardCharts healthData={healthData} />
        </div>
        
        {/* Bottom Section - Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="md:col-span-2">
            <RecentActivity activities={recentActivities} loading={loading} />
          </div>
          
          {/* Upcoming Appointments */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <Calendar className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <p>No upcoming appointments</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Schedule an appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
