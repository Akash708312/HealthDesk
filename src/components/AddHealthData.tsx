
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DatePicker } from './ui/date-picker';
import { Textarea } from './ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Add onSuccess prop to the interface
interface AddHealthDataProps {
  onSuccess?: () => void;
}

const AddHealthData: React.FC<AddHealthDataProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals');
  const [date, setDate] = useState<Date>(new Date());
  
  // Vitals form state
  const [vitalsForm, setVitalsForm] = useState({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
    weight: '',
    temperature: '',
  });

  // Lab results form state
  const [labForm, setLabForm] = useState({
    cholesterolTotal: '',
    cholesterolLDL: '',
    cholesterolHDL: '',
    triglycerides: '',
    hemoglobin: '',
    whiteBloodCellCount: '',
  });

  // Body measurements form state
  const [bodyForm, setBodyForm] = useState({
    height: '',
    waist: '',
    hip: '',
    bmi: '',
    bodyFat: '',
  });

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitalsForm({
      ...vitalsForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabForm({
      ...labForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyForm({
      ...bodyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit health data');
      return;
    }

    setIsSubmitting(true);
    try {
      let data;
      let recordType;

      // Prepare data based on active tab
      switch (activeTab) {
        case 'vitals':
          data = vitalsForm;
          recordType = 'vitals';
          break;
        case 'lab_results':
          data = labForm;
          recordType = 'lab_results';
          break;
        case 'body_measurements':
          data = bodyForm;
          recordType = 'body_measurements';
          break;
        default:
          throw new Error('Invalid tab selected');
      }

      // Insert record into health_records table
      const { error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          record_type: recordType,
          record_date: format(date, 'yyyy-MM-dd'),
          description: JSON.stringify(data),
          status: 'active',
        });

      if (error) throw error;
      
      toast.success('Health data saved successfully!');
      
      // Reset form
      if (activeTab === 'vitals') {
        setVitalsForm({
          heartRate: '',
          bloodPressureSystolic: '',
          bloodPressureDiastolic: '',
          bloodSugar: '',
          weight: '',
          temperature: '',
        });
      } else if (activeTab === 'lab_results') {
        setLabForm({
          cholesterolTotal: '',
          cholesterolLDL: '',
          cholesterolHDL: '',
          triglycerides: '',
          hemoglobin: '',
          whiteBloodCellCount: '',
        });
      } else if (activeTab === 'body_measurements') {
        setBodyForm({
          height: '',
          waist: '',
          hip: '',
          bmi: '',
          bodyFat: '',
        });
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error saving health data:', error);
      toast.error('Failed to save health data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="lab_results">Lab Results</TabsTrigger>
          <TabsTrigger value="body_measurements">Body Measurements</TabsTrigger>
        </TabsList>
        
        <div className="mb-4">
          <Label>Date</Label>
          <DatePicker
            date={date}
            setDate={setDate}
            maxDate={new Date()}
            className="w-full"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <TabsContent value="vitals">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  value={vitalsForm.heartRate}
                  onChange={handleVitalsChange}
                  placeholder="60-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                <div className="flex gap-2">
                  <Input
                    id="bloodPressureSystolic"
                    name="bloodPressureSystolic"
                    type="number"
                    value={vitalsForm.bloodPressureSystolic}
                    onChange={handleVitalsChange}
                    placeholder="Systolic"
                  />
                  <span className="flex items-center">/</span>
                  <Input
                    id="bloodPressureDiastolic"
                    name="bloodPressureDiastolic"
                    type="number"
                    value={vitalsForm.bloodPressureDiastolic}
                    onChange={handleVitalsChange}
                    placeholder="Diastolic"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  name="bloodSugar"
                  type="number"
                  value={vitalsForm.bloodSugar}
                  onChange={handleVitalsChange}
                  placeholder="70-100 fasting"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={vitalsForm.weight}
                  onChange={handleVitalsChange}
                  placeholder="Weight in kg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Body Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={vitalsForm.temperature}
                  onChange={handleVitalsChange}
                  placeholder="36.5-37.5"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lab_results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="cholesterolTotal">Total Cholesterol (mg/dL)</Label>
                <Input
                  id="cholesterolTotal"
                  name="cholesterolTotal"
                  type="number"
                  value={labForm.cholesterolTotal}
                  onChange={handleLabChange}
                  placeholder="Less than 200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cholesterolLDL">LDL Cholesterol (mg/dL)</Label>
                <Input
                  id="cholesterolLDL"
                  name="cholesterolLDL"
                  type="number"
                  value={labForm.cholesterolLDL}
                  onChange={handleLabChange}
                  placeholder="Less than 100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cholesterolHDL">HDL Cholesterol (mg/dL)</Label>
                <Input
                  id="cholesterolHDL"
                  name="cholesterolHDL"
                  type="number"
                  value={labForm.cholesterolHDL}
                  onChange={handleLabChange}
                  placeholder="Greater than 40"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
                <Input
                  id="triglycerides"
                  name="triglycerides"
                  type="number"
                  value={labForm.triglycerides}
                  onChange={handleLabChange}
                  placeholder="Less than 150"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                <Input
                  id="hemoglobin"
                  name="hemoglobin"
                  type="number"
                  step="0.1"
                  value={labForm.hemoglobin}
                  onChange={handleLabChange}
                  placeholder="13.5-17.5 for men, 12-15.5 for women"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whiteBloodCellCount">White Blood Cell Count (per μL)</Label>
                <Input
                  id="whiteBloodCellCount"
                  name="whiteBloodCellCount"
                  type="number"
                  value={labForm.whiteBloodCellCount}
                  onChange={handleLabChange}
                  placeholder="4,500-11,000"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="body_measurements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  value={bodyForm.height}
                  onChange={handleBodyChange}
                  placeholder="Height in cm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waist">Waist Circumference (cm)</Label>
                <Input
                  id="waist"
                  name="waist"
                  type="number"
                  step="0.1"
                  value={bodyForm.waist}
                  onChange={handleBodyChange}
                  placeholder="Waist in cm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hip">Hip Circumference (cm)</Label>
                <Input
                  id="hip"
                  name="hip"
                  type="number"
                  step="0.1"
                  value={bodyForm.hip}
                  onChange={handleBodyChange}
                  placeholder="Hip in cm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.01"
                  value={bodyForm.bmi}
                  onChange={handleBodyChange}
                  placeholder="18.5-24.9 is normal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
                <Input
                  id="bodyFat"
                  name="bodyFat"
                  type="number"
                  step="0.1"
                  value={bodyForm.bodyFat}
                  onChange={handleBodyChange}
                  placeholder="Body fat percentage"
                />
              </div>
            </div>
          </TabsContent>
          
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Health Data'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default AddHealthData;
