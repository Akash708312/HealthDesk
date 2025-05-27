
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Activity, Weight, Heart, Droplet } from 'lucide-react';

interface DashboardChartsProps {
  healthData: {
    vitals: any[];
    bodyMeasurements: any[];
    labResults: any[];
    dietPlans: any[];
  }
}

const DashboardCharts = ({ healthData }: DashboardChartsProps) => {
  const [timeRange, setTimeRange] = useState("week");

  const getVitalsChartData = () => {
    const numRecords = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
    
    // Process vitals data for charts
    const chartData = healthData.vitals
      .slice(0, numRecords) // Get latest records based on time range
      .map(record => {
        const date = new Date(record.record_date);
        return {
          name: `${date.getMonth() + 1}/${date.getDate()}`,
          weight: parseFloat(record.data.weight) || 0,
          heartRate: parseFloat(record.data.heartRate) || 0,
          systolic: parseFloat(record.data.bloodPressureSystolic) || 0,
          diastolic: parseFloat(record.data.bloodPressureDiastolic) || 0,
          bloodSugar: parseFloat(record.data.bloodSugar) || 0
        };
      })
      .reverse(); // Show in chronological order
      
    return chartData;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Health Trends</CardTitle>
          <div className="flex space-x-2">
            <Tabs defaultValue="week" onValueChange={setTimeRange} value={timeRange}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">3 Months</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heartrate">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="heartrate" className="flex gap-1 items-center">
              <Heart className="h-4 w-4" /> Heart Rate
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex gap-1 items-center">
              <Weight className="h-4 w-4" /> Weight
            </TabsTrigger>
            <TabsTrigger value="bp" className="flex gap-1 items-center">
              <Activity className="h-4 w-4" /> Blood Pressure
            </TabsTrigger>
            <TabsTrigger value="sugar" className="flex gap-1 items-center">
              <Droplet className="h-4 w-4" /> Blood Sugar
            </TabsTrigger>
          </TabsList>
          
          {healthData.vitals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available for the selected period. Add health data to see trends.
            </div>
          ) : (
            <>
              <TabsContent value="heartrate">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getVitalsChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate" 
                        name="Heart Rate (bpm)" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="weight">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getVitalsChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        name="Weight (kg)" 
                        stroke="#3b82f6" 
                        strokeWidth={2}  
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="bp">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getVitalsChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        name="Systolic (mmHg)" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        name="Diastolic (mmHg)" 
                        stroke="#22c55e" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="sugar">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getVitalsChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="bloodSugar" 
                        name="Blood Sugar (mg/dL)" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
