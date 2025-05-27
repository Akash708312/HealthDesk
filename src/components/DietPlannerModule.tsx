
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle, MinusCircle, Edit, Trash, Check, ChevronDown, ChevronUp } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
}

interface DietPlan {
  id: string;
  name: string;
  goal: string;
  totalCalories: number;
  meals: Meal[];
}

interface DietGoal {
  value: string;
  label: string;
  description: string;
  calorieModifier: number;
}

const dietGoals: DietGoal[] = [
  {
    value: 'weight_loss',
    label: 'Weight Loss',
    description: 'Reduced calories to promote gradual weight loss',
    calorieModifier: -500
  },
  {
    value: 'maintenance',
    label: 'Maintenance',
    description: 'Balanced calories to maintain current weight',
    calorieModifier: 0
  },
  {
    value: 'muscle_gain',
    label: 'Muscle Gain',
    description: 'Increased calories and protein to support muscle growth',
    calorieModifier: 500
  }
];

// Sample meal templates for each goal type
const mealTemplates: Record<string, Meal[]> = {
  weight_loss: [
    { id: 'wl-1', name: 'Breakfast: Greek Yogurt Bowl', calories: 300, protein: 25, carbs: 30, fat: 10, description: 'Greek yogurt with berries and a sprinkle of granola' },
    { id: 'wl-2', name: 'Lunch: Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fat: 15, description: 'Mixed greens with grilled chicken, vegetables, and light dressing' },
    { id: 'wl-3', name: 'Dinner: Baked Salmon & Vegetables', calories: 450, protein: 30, carbs: 25, fat: 20, description: 'Baked salmon fillet with steamed vegetables and quinoa' },
    { id: 'wl-4', name: 'Snack: Apple with Almond Butter', calories: 200, protein: 5, carbs: 20, fat: 10, description: 'Apple slices with 1 tablespoon of almond butter' }
  ],
  maintenance: [
    { id: 'm-1', name: 'Breakfast: Avocado Toast', calories: 450, protein: 15, carbs: 45, fat: 20, description: 'Whole grain toast with avocado, eggs, and tomato' },
    { id: 'm-2', name: 'Lunch: Grain Bowl', calories: 550, protein: 25, carbs: 65, fat: 18, description: 'Quinoa with roasted vegetables, chicken, and tahini sauce' },
    { id: 'm-3', name: 'Dinner: Turkey Chili', calories: 500, protein: 35, carbs: 50, fat: 15, description: 'Lean turkey chili with beans, vegetables, and brown rice' },
    { id: 'm-4', name: 'Snack: Smoothie', calories: 300, protein: 15, carbs: 40, fat: 5, description: 'Protein smoothie with banana, berries, and spinach' }
  ],
  muscle_gain: [
    { id: 'mg-1', name: 'Breakfast: Protein Oatmeal', calories: 600, protein: 40, carbs: 70, fat: 15, description: 'Oatmeal with protein powder, banana, and peanut butter' },
    { id: 'mg-2', name: 'Lunch: Steak & Sweet Potato', calories: 700, protein: 45, carbs: 65, fat: 20, description: 'Grilled steak with sweet potato and steamed broccoli' },
    { id: 'mg-3', name: 'Dinner: Chicken Pasta', calories: 750, protein: 50, carbs: 80, fat: 20, description: 'Whole wheat pasta with chicken, vegetables, and olive oil' },
    { id: 'mg-4', name: 'Snack: Protein Shake with Nuts', calories: 350, protein: 30, carbs: 15, fat: 15, description: 'Protein shake with a handful of mixed nuts' }
  ]
};

const DietPlannerModule = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Meal[]>([]);
  const [customMeals, setCustomMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    description: ''
  });
  const [planName, setPlanName] = useState("");
  const [bmr, setBmr] = useState(2000); // Default estimated BMR
  const [savedPlans, setSavedPlans] = useState<DietPlan[]>([]);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Fetch user's health data to estimate BMR if available
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: healthRecords } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user.id)
          .eq('record_type', 'body_measurements')
          .order('created_at', { ascending: false })
          .limit(1);
          
        const { data: vitalsRecords } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user.id)
          .eq('record_type', 'vitals')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (healthRecords?.[0] && vitalsRecords?.[0]) {
          // Parse the health data
          const bodyData = JSON.parse(healthRecords[0].description);
          const vitalsData = JSON.parse(vitalsRecords[0].description);
          
          // Simple BMR estimation using Harris-Benedict equation
          // This is just an example - a real implementation would use more factors
          if (bodyData.height && vitalsData.weight) {
            const height = parseFloat(bodyData.height);
            const weight = parseFloat(vitalsData.weight);
            
            // Basic BMR calculation (this is simplified)
            // For a more accurate calculation, you'd need age and gender
            const estimatedBMR = 10 * weight + 6.25 * height - 5 * 30 + 5; // Assumes 30 years old male
            setBmr(Math.round(estimatedBMR));
          }
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    
    fetchHealthData();
    fetchSavedPlans();
  }, []);

  const fetchSavedPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: records, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('record_type', 'diet_plan')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching saved plans:", error);
        return;
      }
      
      if (records && records.length > 0) {
        const plans = records.map(record => {
          const planData = JSON.parse(record.description);
          return {
            id: record.id,
            ...planData
          };
        });
        
        setSavedPlans(plans);
      }
    } catch (error) {
      console.error("Error processing saved plans:", error);
    }
  };

  const handleGoalChange = (goal: string) => {
    setSelectedGoal(goal);
    setSelectedTemplate(mealTemplates[goal]);
    setCustomMeals([...mealTemplates[goal]]);
  };

  const handleNewMealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeal({
      ...newMeal,
      [e.target.name]: e.target.name === 'name' || e.target.name === 'description'
        ? e.target.value
        : parseFloat(e.target.value) || 0
    });
  };

  const addNewMeal = () => {
    if (!newMeal.name) {
      toast.error("Please enter a meal name");
      return;
    }
    
    const meal: Meal = {
      id: `custom-${Date.now()}`,
      name: newMeal.name || '',
      calories: newMeal.calories || 0,
      protein: newMeal.protein || 0,
      carbs: newMeal.carbs || 0,
      fat: newMeal.fat || 0,
      description: newMeal.description || ''
    };
    
    setCustomMeals([...customMeals, meal]);
    
    // Reset form
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: ''
    });
  };

  const removeMeal = (id: string) => {
    setCustomMeals(customMeals.filter(meal => meal.id !== id));
  };

  const startEditMeal = (meal: Meal) => {
    setEditingMealId(meal.id);
    setNewMeal({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      description: meal.description
    });
  };

  const saveEditedMeal = () => {
    if (!editingMealId) return;
    
    setCustomMeals(customMeals.map(meal => {
      if (meal.id === editingMealId) {
        return {
          ...meal,
          name: newMeal.name || meal.name,
          calories: newMeal.calories || meal.calories,
          protein: newMeal.protein || meal.protein,
          carbs: newMeal.carbs || meal.carbs,
          fat: newMeal.fat || meal.fat,
          description: newMeal.description || meal.description
        };
      }
      return meal;
    }));
    
    // Reset editing state
    setEditingMealId(null);
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: ''
    });
  };

  const cancelEditMeal = () => {
    setEditingMealId(null);
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: ''
    });
  };

  const calculateTotalNutrition = () => {
    return customMeals.reduce(
      (total, meal) => {
        return {
          calories: total.calories + meal.calories,
          protein: total.protein + meal.protein,
          carbs: total.carbs + meal.carbs,
          fat: total.fat + meal.fat
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const saveDietPlan = async () => {
    if (!planName) {
      toast.error("Please enter a plan name");
      return;
    }
    
    if (customMeals.length === 0) {
      toast.error("Please add at least one meal to your plan");
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("You must be logged in to save a diet plan");
        return;
      }
      
      const totals = calculateTotalNutrition();
      
      const planData = {
        name: planName,
        goal: selectedGoal,
        totalCalories: totals.calories,
        meals: customMeals
      };
      
      // Save the plan to the database
      const { error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          record_type: 'diet_plan',
          description: JSON.stringify(planData),
          status: 'active'
        });
        
      if (error) {
        console.error("Error saving diet plan:", error);
        toast.error("Failed to save diet plan");
      } else {
        toast.success("Diet plan saved successfully");
        setPlanName("");
        setSelectedGoal("");
        setCustomMeals([]);
        fetchSavedPlans();
        setActiveTab("saved");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting plan:", error);
        toast.error("Failed to delete plan");
      } else {
        toast.success("Plan deleted successfully");
        setSavedPlans(savedPlans.filter(plan => plan.id !== id));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const togglePlanExpansion = (id: string) => {
    if (expandedPlanId === id) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(id);
    }
  };

  const getCalorieTarget = () => {
    if (!selectedGoal) return bmr;
    
    const goal = dietGoals.find(g => g.value === selectedGoal);
    if (!goal) return bmr;
    
    return bmr + goal.calorieModifier;
  };

  const calorieTarget = getCalorieTarget();
  const totals = calculateTotalNutrition();

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Diet Planner</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="planName">Plan Name</Label>
                <Input
                  id="planName"
                  placeholder="Name your diet plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Goal</Label>
                <Select value={selectedGoal} onValueChange={handleGoalChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietGoals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedGoal && (
                  <div className="mt-2 text-sm text-gray-500">
                    {dietGoals.find(g => g.value === selectedGoal)?.description}
                  </div>
                )}
              </div>
              
              {selectedGoal && (
                <>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Your Calorie Target</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Based on your health data</div>
                        <div className="text-lg font-bold">{calorieTarget} calories</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Current plan</div>
                        <div className={`text-lg font-bold ${
                          totals.calories > calorieTarget + 100
                            ? 'text-red-500'
                            : totals.calories < calorieTarget - 100
                            ? 'text-amber-500'
                            : 'text-green-500'
                        }`}>
                          {totals.calories} calories
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Meals</h3>
                    {customMeals.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No meals added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customMeals.map((meal) => (
                          <div key={meal.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{meal.name}</h4>
                                {meal.description && (
                                  <p className="text-sm text-gray-600">{meal.description}</p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => startEditMeal(meal)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeMeal(meal.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                              <div>
                                <span className="text-gray-600">Calories:</span> {meal.calories}
                              </div>
                              <div>
                                <span className="text-gray-600">Protein:</span> {meal.protein}g
                              </div>
                              <div>
                                <span className="text-gray-600">Carbs:</span> {meal.carbs}g
                              </div>
                              <div>
                                <span className="text-gray-600">Fat:</span> {meal.fat}g
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h4 className="font-medium">Daily Totals</h4>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            <div>
                              <span className="text-gray-600">Calories:</span> {totals.calories}
                            </div>
                            <div>
                              <span className="text-gray-600">Protein:</span> {totals.protein}g
                            </div>
                            <div>
                              <span className="text-gray-600">Carbs:</span> {totals.carbs}g
                            </div>
                            <div>
                              <span className="text-gray-600">Fat:</span> {totals.fat}g
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3">
                      {editingMealId ? 'Edit Meal' : 'Add New Meal'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="mealName">Meal Name</Label>
                        <Input
                          id="mealName"
                          name="name"
                          placeholder="Enter meal name"
                          value={newMeal.name}
                          onChange={handleNewMealChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="calories">Calories</Label>
                          <Input
                            id="calories"
                            name="calories"
                            type="number"
                            placeholder="Calories"
                            value={newMeal.calories}
                            onChange={handleNewMealChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input
                            id="protein"
                            name="protein"
                            type="number"
                            placeholder="Protein in grams"
                            value={newMeal.protein}
                            onChange={handleNewMealChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="carbs">Carbs (g)</Label>
                          <Input
                            id="carbs"
                            name="carbs"
                            type="number"
                            placeholder="Carbs in grams"
                            value={newMeal.carbs}
                            onChange={handleNewMealChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="fat">Fat (g)</Label>
                          <Input
                            id="fat"
                            name="fat"
                            type="number"
                            placeholder="Fat in grams"
                            value={newMeal.fat}
                            onChange={handleNewMealChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Meal description"
                          value={newMeal.description}
                          onChange={handleNewMealChange}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        {editingMealId ? (
                          <>
                            <Button 
                              type="button" 
                              onClick={saveEditedMeal}
                              className="flex-1"
                            >
                              <Check className="h-4 w-4 mr-1" /> Save Changes
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={cancelEditMeal}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            type="button" 
                            onClick={addNewMeal} 
                            className="flex-1"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> Add Meal
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {selectedGoal && (
              <Button 
                onClick={saveDietPlan} 
                disabled={loading || !planName || customMeals.length === 0}
                className="w-full"
              >
                {loading ? "Saving..." : "Save Diet Plan"}
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {savedPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't saved any diet plans yet</p>
                <Button onClick={() => setActiveTab("create")}>Create Your First Plan</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlans.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => togglePlanExpansion(plan.id)}
                    >
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <div className="text-sm text-gray-600">
                          Goal: {dietGoals.find(g => g.value === plan.goal)?.label || plan.goal}
                        </div>
                        <div className="text-sm text-gray-600">
                          {plan.totalCalories} calories • {plan.meals.length} meals
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlan(plan.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        {expandedPlanId === plan.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    
                    {expandedPlanId === plan.id && (
                      <div className="px-4 pb-4 space-y-3">
                        <Separator />
                        <div className="space-y-3 mt-3">
                          {plan.meals.map((meal, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div>
                                <h4 className="font-medium">{meal.name}</h4>
                                {meal.description && (
                                  <p className="text-sm text-gray-600">{meal.description}</p>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Calories:</span> {meal.calories}
                                </div>
                                <div>
                                  <span className="text-gray-600">Protein:</span> {meal.protein}g
                                </div>
                                <div>
                                  <span className="text-gray-600">Carbs:</span> {meal.carbs}g
                                </div>
                                <div>
                                  <span className="text-gray-600">Fat:</span> {meal.fat}g
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h4 className="font-medium">Daily Totals</h4>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            <div>
                              <span className="text-gray-600">Calories:</span> {plan.totalCalories}
                            </div>
                            <div>
                              <span className="text-gray-600">Protein:</span> {
                                plan.meals.reduce((sum, meal) => sum + meal.protein, 0)
                              }g
                            </div>
                            <div>
                              <span className="text-gray-600">Carbs:</span> {
                                plan.meals.reduce((sum, meal) => sum + meal.carbs, 0)
                              }g
                            </div>
                            <div>
                              <span className="text-gray-600">Fat:</span> {
                                plan.meals.reduce((sum, meal) => sum + meal.fat, 0)
                              }g
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setPlanName(plan.name);
                            setSelectedGoal(plan.goal);
                            setCustomMeals(plan.meals);
                            setActiveTab("create");
                          }}
                        >
                          Copy to New Plan
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DietPlannerModule;
