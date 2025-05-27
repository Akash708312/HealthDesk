
import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Calculator } from 'lucide-react';

const HealthTools = () => {
  // BMI Calculator
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [isBmiCalculating, setIsBmiCalculating] = useState(false);
  
  // Calorie Calculator
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [calorieWeight, setCalorieWeight] = useState('');
  const [calorieHeight, setCalorieHeight] = useState('');
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [isCalorieCalculating, setIsCalorieCalculating] = useState(false);

  // Water Intake Calculator
  const [waterWeight, setWaterWeight] = useState('');
  const [waterActivityLevel, setWaterActivityLevel] = useState('moderate');
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [isWaterCalculating, setIsWaterCalculating] = useState(false);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBmiCalculating(true);
    
    setTimeout(() => {
      try {
        let weightInKg = parseFloat(weight);
        let heightInM = parseFloat(height);
        
        // Convert units if necessary
        if (weightUnit === 'lbs') {
          weightInKg = weightInKg * 0.453592; // lbs to kg
        }
        
        if (heightUnit === 'cm') {
          heightInM = heightInM / 100; // cm to m
        } else if (heightUnit === 'ft') {
          heightInM = heightInM * 0.3048; // ft to m
        }
        
        if (weightInKg <= 0 || heightInM <= 0) {
          throw new Error('Values must be positive numbers');
        }
        
        // Calculate BMI
        const bmi = weightInKg / (heightInM * heightInM);
        setBmiResult(parseFloat(bmi.toFixed(1)));
        
        // Determine BMI category
        if (bmi < 18.5) {
          setBmiCategory('Underweight');
        } else if (bmi < 25) {
          setBmiCategory('Normal weight');
        } else if (bmi < 30) {
          setBmiCategory('Overweight');
        } else {
          setBmiCategory('Obese');
        }
      } catch (error) {
        setBmiResult(null);
        setBmiCategory('');
      } finally {
        setIsBmiCalculating(false);
      }
    }, 500);
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalorieCalculating(true);
    
    setTimeout(() => {
      try {
        const ageVal = parseInt(age);
        let weightVal = parseFloat(calorieWeight);
        let heightVal = parseFloat(calorieHeight);
        
        // Convert to metric if needed
        // Assuming height is in cm and weight is in kg
        
        if (ageVal <= 0 || weightVal <= 0 || heightVal <= 0) {
          throw new Error('Values must be positive numbers');
        }
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
          bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5;
        } else {
          bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;
        }
        
        // Apply activity multiplier
        let activityMultiplier;
        switch (activityLevel) {
          case 'sedentary':
            activityMultiplier = 1.2;
            break;
          case 'light':
            activityMultiplier = 1.375;
            break;
          case 'moderate':
            activityMultiplier = 1.55;
            break;
          case 'active':
            activityMultiplier = 1.725;
            break;
          case 'very_active':
            activityMultiplier = 1.9;
            break;
          default:
            activityMultiplier = 1.55;
        }
        
        const calories = bmr * activityMultiplier;
        setDailyCalories(Math.round(calories));
      } catch (error) {
        setDailyCalories(null);
      } finally {
        setIsCalorieCalculating(false);
      }
    }, 500);
  };

  const calculateWaterIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWaterCalculating(true);
    
    setTimeout(() => {
      try {
        const weightVal = parseFloat(waterWeight);
        
        if (weightVal <= 0) {
          throw new Error('Weight must be a positive number');
        }
        
        // Base calculation: 30ml per kg of body weight
        let waterAmount = weightVal * 30;
        
        // Adjust for activity level
        switch (waterActivityLevel) {
          case 'sedentary':
            waterAmount *= 1;
            break;
          case 'light':
            waterAmount *= 1.1;
            break;
          case 'moderate':
            waterAmount *= 1.2;
            break;
          case 'active':
            waterAmount *= 1.3;
            break;
          case 'very_active':
            waterAmount *= 1.4;
            break;
          default:
            waterAmount *= 1.2;
        }
        
        // Convert to liters
        const waterInLiters = waterAmount / 1000;
        setWaterIntake(parseFloat(waterInLiters.toFixed(1)));
      } catch (error) {
        setWaterIntake(null);
      } finally {
        setIsWaterCalculating(false);
      }
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Health Tools</h1>
          <p className="text-muted-foreground">Calculate important health metrics with our easy-to-use tools</p>
        </div>
        
        <Tabs defaultValue="bmi" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
            <TabsTrigger value="calorie">Calorie Calculator</TabsTrigger>
            <TabsTrigger value="water">Water Intake</TabsTrigger>
          </TabsList>
          
          {/* BMI Calculator Tab */}
          <TabsContent value="bmi">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>BMI Calculator</CardTitle>
                  <CardDescription>
                    Calculate your Body Mass Index (BMI) to assess if your weight is in healthy proportion to your height.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={calculateBMI}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="1"
                          step="0.1"
                          placeholder="Enter weight"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight-unit">Unit</Label>
                        <Select value={weightUnit} onValueChange={setWeightUnit}>
                          <SelectTrigger id="weight-unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          step="0.1"
                          placeholder="Enter height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="height-unit">Unit</Label>
                        <Select value={heightUnit} onValueChange={setHeightUnit}>
                          <SelectTrigger id="height-unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isBmiCalculating}>
                      {isBmiCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Calculate BMI'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                  <CardDescription>
                    BMI is a screening tool, not a diagnostic tool. Consult with a healthcare provider for proper evaluation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6 py-6">
                  {bmiResult !== null ? (
                    <>
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                        <div className="text-center">
                          <div className="text-4xl font-bold">{bmiResult}</div>
                          <div className="text-sm text-muted-foreground">Your BMI</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">
                          {bmiCategory}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {bmiCategory === 'Underweight'
                            ? 'You may need to gain weight. Consult with a healthcare professional.'
                            : bmiCategory === 'Normal weight'
                            ? 'Your weight is in the healthy range. Keep up the good work!'
                            : bmiCategory === 'Overweight'
                            ? 'You may need to lose some weight for better health.'
                            : 'You may be at increased risk for health problems. Consider consulting a healthcare professional.'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                        <Calculator className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">Enter your details</h3>
                      <p className="text-gray-500">
                        Fill in your weight and height to calculate your BMI
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Calorie Calculator Tab */}
          <TabsContent value="calorie">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Calorie Calculator</CardTitle>
                  <CardDescription>
                    Estimate how many calories you need per day based on your details and activity level.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={calculateCalories}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="1"
                          max="120"
                          placeholder="Years"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight-calorie">Weight (kg)</Label>
                        <Input
                          id="weight-calorie"
                          type="number"
                          min="1"
                          step="0.1"
                          placeholder="Kilograms"
                          value={calorieWeight}
                          onChange={(e) => setCalorieWeight(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="height-calorie">Height (cm)</Label>
                        <Input
                          id="height-calorie"
                          type="number"
                          min="1"
                          placeholder="Centimeters"
                          value={calorieHeight}
                          onChange={(e) => setCalorieHeight(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="activity">Activity Level</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger id="activity">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very_active">Very Active (hard exercise daily)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isCalorieCalculating}>
                      {isCalorieCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Calculate Calories'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Daily Calories</CardTitle>
                  <CardDescription>
                    This is an estimate of the calories you need to maintain your current weight.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6 py-6">
                  {dailyCalories !== null ? (
                    <>
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-green-100"></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">{dailyCalories}</div>
                          <div className="text-sm text-muted-foreground">Calories/day</div>
                        </div>
                      </div>
                      
                      <div className="text-center max-w-md">
                        <h3 className="font-semibold text-lg mb-2">Maintenance Calories</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is approximately how many calories you need each day to maintain your current weight.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <p className="font-medium">{Math.round(dailyCalories * 0.8)}</p>
                            <p className="text-xs text-gray-500">Weight Loss</p>
                          </div>
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <p className="font-medium">{dailyCalories}</p>
                            <p className="text-xs text-gray-500">Maintenance</p>
                          </div>
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <p className="font-medium">{Math.round(dailyCalories * 1.2)}</p>
                            <p className="text-xs text-gray-500">Weight Gain</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                        <Calculator className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">Enter your details</h3>
                      <p className="text-gray-500">
                        Fill in your information to calculate your daily calorie needs
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Water Intake Calculator Tab */}
          <TabsContent value="water">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Water Intake Calculator</CardTitle>
                  <CardDescription>
                    Estimate how much water you should drink every day based on your weight and activity level.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={calculateWaterIntake}>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="water-weight">Weight (kg)</Label>
                      <Input
                        id="water-weight"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Enter your weight in kilograms"
                        value={waterWeight}
                        onChange={(e) => setWaterWeight(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="water-activity">Activity Level</Label>
                      <Select value={waterActivityLevel} onValueChange={setWaterActivityLevel}>
                        <SelectTrigger id="water-activity">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very_active">Very Active (hard exercise daily)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isWaterCalculating}>
                      {isWaterCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Calculate Water Intake'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Daily Water Intake</CardTitle>
                  <CardDescription>
                    Recommended amount of water you should drink every day for optimal hydration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6 py-6">
                  {waterIntake !== null ? (
                    <>
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-blue-100"></div>
                        <div className="text-center">
                          <div className="text-4xl font-bold">{waterIntake}</div>
                          <div className="text-sm text-muted-foreground">Liters/day</div>
                        </div>
                      </div>
                      
                      <div className="text-center max-w-md">
                        <h3 className="font-semibold text-lg mb-2">Hydration Recommendation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is approximately how much water you should drink each day to stay properly hydrated.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm">
                            That's about {Math.round(waterIntake * 4)} glasses (250ml) of water per day. 
                            Remember to drink more during hot weather or when exercising.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                        <Calculator className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">Enter your details</h3>
                      <p className="text-gray-500">
                        Fill in your weight and activity level to calculate your daily water needs
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HealthTools;
