
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Heart, 
  Activity, 
  Utensils, 
  Droplet, 
  Clock, 
  Brain, 
  Sun 
} from 'lucide-react';

interface HealthTip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PreventiveHealthTips = () => {
  const tips: HealthTip[] = [
    {
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      title: "Regular Exercise",
      description: "Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening activities twice weekly."
    },
    {
      icon: <Utensils className="h-8 w-8 text-green-500" />,
      title: "Balanced Diet",
      description: "Eat a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt."
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "Quality Sleep",
      description: "Adults should aim for 7-9 hours of quality sleep per night. Establish a regular sleep schedule and create a relaxing bedtime routine."
    },
    {
      icon: <Droplet className="h-8 w-8 text-cyan-500" />,
      title: "Stay Hydrated",
      description: "Drink plenty of water throughout the day. The recommended amount varies by individual, but a good rule is to drink when thirsty and maintain pale yellow urine."
    },
    {
      icon: <Brain className="h-8 w-8 text-amber-500" />,
      title: "Manage Stress",
      description: "Practice stress-reduction techniques such as mindfulness, meditation, deep breathing, yoga, or other activities you enjoy."
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Get Regular Checkups",
      description: "Schedule routine screenings and preventive care visits appropriate for your age, gender, and risk factors."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Preventive Health Tips
        </CardTitle>
        <CardDescription>
          Simple daily habits for long-term health and wellbeing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-primary-50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 bg-white p-3 rounded-full border">
                  {tip.icon}
                </div>
                <h3 className="font-medium mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreventiveHealthTips;
