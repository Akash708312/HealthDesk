
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, Heart, Weight, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from './ui/progress';

interface StatsProps {
  vitals: any[];
}

const DashboardStats = ({ vitals }: StatsProps) => {
  const getLatestVital = () => {
    if (vitals.length === 0) {
      return null;
    }
    return vitals[0].data;
  };

  const latestVital = getLatestVital();

  const calculateProgress = (current: number, target: number, isLowerBetter = false) => {
    if (!current || !target) return 50;
    
    const progress = isLowerBetter 
      ? Math.max(0, 100 - (current / target * 100))
      : Math.min(100, (current / target * 100));
      
    return Math.round(progress);
  };
  
  const getStatusColor = (progress: number) => {
    if (progress > 90) return "text-green-500";
    if (progress > 70) return "text-blue-500";
    if (progress > 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {!latestVital ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No health data recorded yet</p>
              <p className="text-sm text-gray-400">Add your first vital signs measurement to see statistics here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {latestVital.heartRate || "--"} <span className="text-sm text-gray-400">BPM</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Target: 60-100 BPM</p>
                </div>
                <div className={getStatusColor(calculateProgress(latestVital.heartRate, 80))}>
                  {parseInt(latestVital.heartRate) < 80 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>
              </div>
              <Progress 
                className="h-2 mt-2" 
                value={calculateProgress(latestVital.heartRate, 80)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <Weight className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {latestVital.weight || "--"} <span className="text-sm text-gray-400">kg</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Target: {Math.round(parseFloat(latestVital.weight) * 0.9)} kg</p>
                </div>
                <div className={getStatusColor(calculateProgress(latestVital.weight, latestVital.weight * 1.1, true))}>
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
              <Progress 
                className="h-2 mt-2" 
                value={calculateProgress(latestVital.weight, latestVital.weight * 1.1, true)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {latestVital.bloodPressureSystolic || "--"}/{latestVital.bloodPressureDiastolic || "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">Target: &lt;120/80 mmHg</p>
                </div>
                <div className={getStatusColor(calculateProgress(120, parseInt(latestVital.bloodPressureSystolic) || 120, true))}>
                  {parseInt(latestVital.bloodPressureSystolic) < 120 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>
              </div>
              <Progress 
                className="h-2 mt-2" 
                value={calculateProgress(120, parseInt(latestVital.bloodPressureSystolic) || 120, true)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Sugar</CardTitle>
              <Thermometer className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">
                    {latestVital.bloodSugar || "--"} <span className="text-sm text-gray-400">mg/dL</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Target: 70-100 mg/dL</p>
                </div>
                <div className={getStatusColor(calculateProgress(parseInt(latestVital.bloodSugar) || 100, 100, true))}>
                  {parseInt(latestVital.bloodSugar) < 100 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>
              </div>
              <Progress 
                className="h-2 mt-2" 
                value={calculateProgress(parseInt(latestVital.bloodSugar) || 100, 100, true)}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardStats;
