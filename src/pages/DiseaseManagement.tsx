import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Eye, 
  Pill, 
  Utensils, 
  Leaf, 
  Heart, 
  Droplet, 
  Bug, 
  Activity, 
  CalendarDays, 
  Book,
  AlertCircle,
  Clock,
  Search,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Disease information type
interface DiseaseInfo {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  prevention: string[];
  diet: string[];
  treatments: string[];
  risk_factors: string[];
  icon: React.ReactNode;
  resources?: {
    title: string;
    url: string;
    type: 'Article' | 'Video' | 'Research';
  }[];
}

const DiseaseManagement = () => {
  const [activeDisease, setActiveDisease] = useState<string>("diabetes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedDiseases, setSavedDiseases] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState<number>(75);
  const { isAuthenticated } = useAuth();
  
  // Load saved diseases from local storage
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem('savedDiseases');
      if (saved) {
        setSavedDiseases(JSON.parse(saved));
      }
    }
  }, [isAuthenticated]);

  // Save to local storage when savedDiseases changes
  useEffect(() => {
    if (isAuthenticated && savedDiseases.length > 0) {
      localStorage.setItem('savedDiseases', JSON.stringify(savedDiseases));
    }
  }, [savedDiseases, isAuthenticated]);

  const toggleSaveDisease = (diseaseId: string) => {
    if (isAuthenticated) {
      if (savedDiseases.includes(diseaseId)) {
        setSavedDiseases(savedDiseases.filter(id => id !== diseaseId));
        toast.success("Removed from saved diseases");
      } else {
        setSavedDiseases([...savedDiseases, diseaseId]);
        toast.success("Added to saved diseases");
      }
    } else {
      toast.error("Please login to save diseases");
    }
  };
  
  // Disease information database
  const diseases: DiseaseInfo[] = [
    {
      id: "diabetes",
      name: "Diabetes",
      description: "Diabetes is a chronic health condition that affects how your body turns food into energy. It occurs when your blood glucose is too high because your body doesn't make enough insulin or can't use insulin as well as it should.",
      symptoms: [
        "Increased thirst and urination",
        "Increased hunger",
        "Fatigue",
        "Blurred vision",
        "Numbness or tingling in hands or feet",
        "Slow-healing sores",
        "Unexplained weight loss"
      ],
      prevention: [
        "Maintain a healthy weight",
        "Exercise regularly (at least 30 minutes, 5 days a week)",
        "Follow a balanced, low-sugar diet",
        "Quit smoking",
        "Limit alcohol consumption",
        "Regular health check-ups",
        "Manage stress effectively"
      ],
      diet: [
        "Focus on non-starchy vegetables",
        "Minimize added sugars and refined grains",
        "Choose whole grains over processed carbohydrates",
        "Include lean proteins like fish, chicken, and plant-based options",
        "Incorporate healthy fats from nuts, seeds, and olive oil",
        "Stay hydrated with water instead of sugary beverages",
        "Practice portion control"
      ],
      treatments: [
        "Insulin therapy",
        "Oral medications",
        "Blood sugar monitoring",
        "Healthy eating and physical activity",
        "Pancreas transplant (in rare cases)",
        "Bariatric surgery (for some people with type 2 diabetes)",
        "Regular medical check-ups"
      ],
      risk_factors: [
        "Family history of diabetes",
        "Overweight or obesity",
        "Physical inactivity",
        "Age (45+)",
        "High blood pressure",
        "History of gestational diabetes",
        "Polycystic ovary syndrome (PCOS)"
      ],
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: "pcos",
      name: "PCOS (Polycystic Ovary Syndrome)",
      description: "PCOS is a hormonal disorder common among women of reproductive age. Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels.",
      symptoms: [
        "Irregular periods or no periods",
        "Heavy bleeding",
        "Excess hair growth (hirsutism)",
        "Acne",
        "Weight gain or difficulty losing weight",
        "Darkening of skin",
        "Thinning hair or hair loss"
      ],
      prevention: [
        "Maintain a healthy weight",
        "Regular physical activity",
        "Healthy eating habits",
        "Regular health check-ups",
        "Stress management",
        "Adequate sleep",
        "Avoid smoking and limit alcohol"
      ],
      diet: [
        "Focus on high-fiber foods",
        "Choose anti-inflammatory foods",
        "Include lean proteins",
        "Limit processed foods and added sugars",
        "Choose low-glycemic index foods",
        "Stay hydrated",
        "Consider vitamin D and omega-3 supplements (consult doctor)"
      ],
      treatments: [
        "Hormonal birth control",
        "Anti-androgen medications",
        "Metformin to improve insulin resistance",
        "Clomiphene for fertility",
        "Lifestyle modifications",
        "Surgery (in rare cases)",
        "Regular monitoring"
      ],
      risk_factors: [
        "Family history of PCOS",
        "Obesity",
        "Insulin resistance",
        "Inflammation",
        "Exposure to certain environmental toxins",
        "Early onset of puberty",
        "Genetic factors"
      ],
      icon: <CalendarDays className="h-5 w-5" />,
      resources: [
        {
          title: "PCOS Awareness Association",
          url: "https://www.pcosaa.org/",
          type: "Article"
        },
        {
          title: "PCOS Diet & Nutrition Guide",
          url: "https://www.healthline.com/nutrition/pcos-diet",
          type: "Article"
        }
      ]
    },
    {
      id: "pcod",
      name: "PCOD (Polycystic Ovarian Disease)",
      description: "PCOD is a condition where multiple small cysts develop in the ovaries, leading to hormonal imbalance. It is often used interchangeably with PCOS but has some clinical differences.",
      symptoms: [
        "Irregular periods",
        "Heavy bleeding during periods",
        "Weight gain",
        "Excess facial and body hair",
        "Male-pattern baldness",
        "Acne",
        "Pelvic pain"
      ],
      prevention: [
        "Maintain healthy weight",
        "Regular exercise",
        "Balanced diet",
        "Stress reduction",
        "Regular medical check-ups",
        "Adequate sleep",
        "Limited alcohol consumption"
      ],
      diet: [
        "Limit processed foods and sugars",
        "Increase fiber intake",
        "Include anti-inflammatory foods",
        "Choose lean proteins",
        "Include healthy fats",
        "Stay well-hydrated",
        "Consider chromium-rich foods"
      ],
      treatments: [
        "Oral contraceptives",
        "Anti-androgen medications",
        "Insulin-sensitizing agents",
        "Lifestyle modifications",
        "Ovulation induction for fertility",
        "Surgical interventions (in some cases)",
        "Regular monitoring"
      ],
      risk_factors: [
        "Family history",
        "Obesity",
        "Sedentary lifestyle",
        "Poor diet high in refined carbohydrates",
        "Chronic stress",
        "Endocrine disruptors",
        "Insulin resistance"
      ],
      icon: <CalendarDays className="h-5 w-5" />
    },
    {
      id: "cancer",
      name: "Cancer",
      description: "Cancer is a disease in which some of the body's cells grow uncontrollably and spread to other parts of the body. It can start almost anywhere in the human body.",
      symptoms: [
        "Unexplained weight loss",
        "Fatigue",
        "Pain",
        "Skin changes",
        "Changes in bowel or bladder habits",
        "Unusual bleeding or discharge",
        "Persistent cough or trouble breathing"
      ],
      prevention: [
        "Don't use tobacco",
        "Eat a healthy diet",
        "Maintain a healthy weight and be physically active",
        "Protect yourself from the sun",
        "Get vaccinated (HPV and Hepatitis vaccines)",
        "Regular screening and self-exams",
        "Avoid risky behaviors"
      ],
      diet: [
        "Plenty of fruits and vegetables",
        "Whole grains",
        "Lean proteins",
        "Limit processed meats",
        "Limit alcohol consumption",
        "Maintain healthy weight",
        "Stay hydrated"
      ],
      treatments: [
        "Surgery",
        "Chemotherapy",
        "Radiation therapy",
        "Immunotherapy",
        "Targeted therapy",
        "Hormone therapy",
        "Stem cell transplant"
      ],
      risk_factors: [
        "Age",
        "Family history",
        "Tobacco use",
        "Alcohol consumption",
        "Sun exposure",
        "Certain viruses (HPV, Hepatitis)",
        "Obesity"
      ],
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: "malaria",
      name: "Malaria",
      description: "Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes.",
      symptoms: [
        "Fever",
        "Chills",
        "Headache",
        "Nausea and vomiting",
        "Muscle pain and fatigue",
        "Sweating",
        "Chest or abdominal pain"
      ],
      prevention: [
        "Use insecticide-treated mosquito nets",
        "Indoor residual spraying",
        "Antimalarial medications when traveling",
        "Cover exposed skin",
        "Use insect repellent",
        "Drain standing water",
        "Seek medical attention if symptoms develop"
      ],
      diet: [
        "Stay hydrated",
        "Consume easily digestible foods",
        "Plenty of fruits and vegetables",
        "Light, nutritious meals",
        "Foods rich in vitamin C",
        "Iron-rich foods",
        "Avoid heavy, greasy foods during recovery"
      ],
      treatments: [
        "Antimalarial medications",
        "Supportive care",
        "Rest and hydration",
        "Treatment of complications",
        "Follow-up testing",
        "Prevention of recurrence",
        "Complementary care"
      ],
      risk_factors: [
        "Living in or visiting areas with malaria",
        "Season (rainy seasons in tropical areas)",
        "Time of day (mosquitoes most active at dawn and dusk)",
        "Poverty and poor housing conditions",
        "Lack of preventive measures",
        "Age (young children and elderly)",
        "Pregnancy"
      ],
      icon: <Droplet className="h-5 w-5" />
    },
    {
      id: "jaundice",
      name: "Jaundice",
      description: "Jaundice is a condition in which the skin, whites of the eyes, and mucous membranes turn yellow because of a high level of bilirubin, a yellow-orange bile pigment.",
      symptoms: [
        "Yellowing of skin and whites of eyes",
        "Dark urine",
        "Pale stools",
        "Itchy skin",
        "Fatigue",
        "Abdominal pain",
        "Weight loss"
      ],
      prevention: [
        "Limit alcohol consumption",
        "Maintain a healthy weight",
        "Avoid risky behaviors that can lead to hepatitis",
        "Get vaccinated against hepatitis",
        "Practice good hygiene",
        "Be careful with medications",
        "Stay hydrated"
      ],
      diet: [
        "Low-fat foods",
        "High-fiber foods",
        "Plenty of fruits and vegetables",
        "Adequate hydration",
        "Avoid alcohol",
        "Limit processed foods",
        "Consider small, frequent meals"
      ],
      treatments: [
        "Treating the underlying cause",
        "Light therapy for newborns",
        "Medications",
        "Lifestyle changes",
        "Surgery in some cases",
        "Regular monitoring",
        "Supportive care"
      ],
      risk_factors: [
        "Liver disease",
        "Bile duct obstruction",
        "Certain medications",
        "Blood disorders",
        "Genetic conditions",
        "Infections",
        "Alcohol abuse"
      ],
      icon: <Droplet className="h-5 w-5" />
    },
    {
      id: "std",
      name: "Sexually Transmitted Diseases",
      description: "Sexually transmitted diseases (STDs) are infections that are passed from one person to another through sexual contact. Many STDs can be cured and all can be treated.",
      symptoms: [
        "Unusual discharge from penis or vagina",
        "Burning sensation during urination",
        "Sores or bumps on genitals or oral/rectal area",
        "Unusual vaginal bleeding",
        "Pain during sex",
        "Rash over the trunk, hands, or feet",
        "Some STDs may cause no symptoms"
      ],
      prevention: [
        "Practice safe sex (use condoms)",
        "Limit number of sexual partners",
        "Regular STD testing",
        "Get vaccinated (HPV, Hepatitis B)",
        "Open communication with partners",
        "Abstinence",
        "Avoid alcohol/drugs that could lead to risky behavior"
      ],
      diet: [
        "Maintain a balanced diet",
        "Foods rich in vitamins and minerals",
        "Adequate hydration",
        "Probiotic-rich foods",
        "Foods that boost immune system",
        "Limit alcohol consumption",
        "Avoid excessive caffeine"
      ],
      treatments: [
        "Antibiotics for bacterial STDs",
        "Antiviral medications for viral STDs",
        "Regular monitoring",
        "Partner notification",
        "Abstinence during treatment",
        "Follow-up testing",
        "Supportive care"
      ],
      risk_factors: [
        "Unprotected sex",
        "Multiple sexual partners",
        "History of STDs",
        "Age (15-24 at higher risk)",
        "Substance abuse",
        "Sexual assault",
        "Men who have sex with men (higher risk for certain STDs)"
      ],
      icon: <Bug className="h-5 w-5" />
    },
    {
      id: "menstrual",
      name: "Menstrual Care",
      description: "Menstrual care involves managing menstrual health and addressing issues related to the menstrual cycle. Proper care can help prevent complications and improve quality of life.",
      symptoms: [
        "Period pain (dysmenorrhea)",
        "Heavy bleeding (menorrhagia)",
        "Irregular periods",
        "Premenstrual syndrome (PMS)",
        "Mood changes",
        "Fatigue",
        "Bloating"
      ],
      prevention: [
        "Regular exercise",
        "Healthy diet",
        "Stress management",
        "Adequate sleep",
        "Maintaining healthy weight",
        "Regular check-ups",
        "Tracking your cycle"
      ],
      diet: [
        "Iron-rich foods",
        "Calcium-rich foods",
        "Omega-3 fatty acids",
        "Complex carbohydrates",
        "Anti-inflammatory foods",
        "Plenty of water",
        "Limit caffeine, alcohol, and salt"
      ],
      treatments: [
        "Over-the-counter pain relievers",
        "Hormonal birth control",
        "Heating pads for cramps",
        "Regular exercise",
        "Stress management techniques",
        "Prescription medications for severe symptoms",
        "Surgery for underlying conditions"
      ],
      risk_factors: [
        "Family history of menstrual disorders",
        "Age (early puberty or approaching menopause)",
        "Obesity",
        "Eating disorders",
        "Excessive exercise",
        "Stress",
        "Underlying medical conditions"
      ],
      icon: <CalendarDays className="h-5 w-5" />
    },
    {
      id: "hypertension",
      name: "Hypertension (High Blood Pressure)",
      description: "Hypertension is a common condition where the long-term force of blood against artery walls is high enough to potentially cause health problems, such as heart disease.",
      symptoms: [
        "Often no symptoms (silent killer)",
        "Headaches (severe)",
        "Shortness of breath",
        "Nosebleeds",
        "Flushing",
        "Dizziness",
        "Chest pain"
      ],
      prevention: [
        "Regular physical activity",
        "Healthy diet low in sodium",
        "Maintain healthy weight",
        "Limit alcohol consumption",
        "Quit smoking",
        "Manage stress",
        "Regular blood pressure monitoring"
      ],
      diet: [
        "DASH diet (Dietary Approaches to Stop Hypertension)",
        "Reduce sodium intake",
        "Increase potassium-rich foods",
        "Limit caffeine",
        "Reduce processed foods",
        "Include whole grains and lean proteins",
        "Increase fruits and vegetables"
      ],
      treatments: [
        "Lifestyle modifications",
        "Diuretics",
        "ACE inhibitors",
        "Angiotensin II receptor blockers",
        "Calcium channel blockers",
        "Beta-blockers",
        "Regular monitoring"
      ],
      risk_factors: [
        "Age (increases with age)",
        "Family history",
        "Obesity",
        "Sedentary lifestyle",
        "High sodium diet",
        "Excessive alcohol consumption",
        "Stress"
      ],
      icon: <Activity className="h-5 w-5" />,
      resources: [
        {
          title: "American Heart Association - High Blood Pressure",
          url: "https://www.heart.org/en/health-topics/high-blood-pressure",
          type: "Article"
        },
        {
          title: "DASH Diet for Hypertension",
          url: "https://www.nhlbi.nih.gov/health-topics/dash-eating-plan",
          type: "Article"
        }
      ]
    },
    {
      id: "asthma",
      name: "Asthma",
      description: "Asthma is a condition in which your airways narrow and swell and may produce extra mucus, making breathing difficult and triggering coughing, wheezing and shortness of breath.",
      symptoms: [
        "Shortness of breath",
        "Chest tightness or pain",
        "Wheezing when exhaling",
        "Trouble sleeping due to breathing difficulty",
        "Coughing or wheezing attacks",
        "Fatigue",
        "Difficulty speaking due to shortness of breath"
      ],
      prevention: [
        "Identify and avoid triggers",
        "Regular use of controller medications",
        "Allergy-proof your home",
        "Get vaccinated for flu and pneumonia",
        "Monitor breathing",
        "Follow asthma action plan",
        "Regular check-ups with healthcare provider"
      ],
      diet: [
        "Anti-inflammatory foods",
        "Fruits and vegetables high in antioxidants",
        "Omega-3 rich foods",
        "Vitamin D rich foods",
        "Avoid sulfites in food",
        "Limit processed foods",
        "Stay hydrated"
      ],
      treatments: [
        "Inhaled corticosteroids",
        "Long-acting beta agonists",
        "Combination inhalers",
        "Quick-relief medications",
        "Leukotriene modifiers",
        "Immunotherapy",
        "Biologics"
      ],
      risk_factors: [
        "Family history of asthma",
        "Allergies",
        "Obesity",
        "Smoking or exposure to secondhand smoke",
        "Occupational exposures",
        "Air pollution",
        "Respiratory infections"
      ],
      icon: <Heart className="h-5 w-5" />,
      resources: [
        {
          title: "Asthma and Allergy Foundation of America",
          url: "https://www.aafa.org/",
          type: "Article"
        },
        {
          title: "CDC - Asthma Management",
          url: "https://www.cdc.gov/asthma/",
          type: "Research"
        }
      ]
    }
  ];
  
  // Find the currently active disease
  const currentDisease = diseases.find(disease => disease.id === activeDisease) || diseases[0];

  // Filter diseases based on search query
  const filteredDiseases = diseases.filter(disease => 
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Disease Management</h1>
            <p className="text-muted-foreground">Track and manage chronic conditions with personalized care plans and information</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diseases..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Health Profile</CardTitle>
              <CardDescription>Personalized disease risk assessment and health score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Health score</p>
                  <div className="flex items-center gap-4">
                    <Progress value={healthScore} className="h-2" />
                    <span className="font-medium text-sm">{healthScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on your health data and lifestyle</p>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Disease risk factors</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Family history
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        Good diet
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                        Stress levels
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Sleep quality
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Saved Diseases</h4>
                      <span className="text-xs text-muted-foreground">{savedDiseases.length} saved</span>
                    </div>
                    {savedDiseases.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No saved diseases yet</p>
                    ) : (
                      <div className="space-y-2">
                        {savedDiseases.map(id => {
                          const disease = diseases.find(d => d.id === id);
                          if (!disease) return null;
                          return (
                            <div key={id} className="flex items-center justify-between p-2 bg-white rounded-md border">
                              <div className="flex items-center gap-2">
                                {disease.icon}
                                <span className="text-sm">{disease.name}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => toggleSaveDisease(id)}>
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="ml-auto">
                    View Complete Health Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Disease</CardTitle>
                <CardDescription>Choose a condition to learn more</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredDiseases.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No diseases found matching your search</p>
                  ) : (
                    filteredDiseases.map(disease => (
                      <button
                        key={disease.id}
                        onClick={() => setActiveDisease(disease.id)}
                        className={`flex items-center w-full p-3 rounded-md text-left transition-colors ${
                          activeDisease === disease.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="mr-2">{disease.icon}</span>
                        <span>{disease.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">{currentDisease.icon}</span>
                    <span>{currentDisease.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-1.5">{currentDisease.description}</CardDescription>
                </div>
                <Button 
                  variant={savedDiseases.includes(currentDisease.id) ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => toggleSaveDisease(currentDisease.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${savedDiseases.includes(currentDisease.id) ? "fill-white" : ""}`} />
                  {savedDiseases.includes(currentDisease.id) ? "Saved" : "Save"}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="symptoms" className="w-full">
                  <TabsList className="w-full grid grid-cols-5 mb-4">
                    <TabsTrigger value="symptoms" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" /> Symptoms
                    </TabsTrigger>
                    <TabsTrigger value="prevention" className="flex items-center">
                      <Leaf className="h-4 w-4 mr-2" /> Prevention
                    </TabsTrigger>
                    <TabsTrigger value="diet" className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2" /> Diet
                    </TabsTrigger>
                    <TabsTrigger value="treatment" className="flex items-center">
                      <Pill className="h-4 w-4 mr-2" /> Treatment
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Resources
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="symptoms" className="space-y-4">
                    <h3 className="text-lg font-medium">Common Symptoms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentDisease.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                          <span className="bg-primary/20 p-1 rounded-full text-primary mr-2">
                            <Eye className="h-4 w-4" />
                          </span>
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="risk-factors">
                        <AccordionTrigger>Risk Factors</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-6 space-y-1">
                            {currentDisease.risk_factors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="prevention" className="space-y-4">
                    <h3 className="text-lg font-medium">Prevention Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentDisease.prevention.map((item, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                          <span className="bg-primary/20 p-1 rounded-full text-primary mr-2">
                            <Leaf className="h-4 w-4" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="diet" className="space-y-4">
                    <h3 className="text-lg font-medium">Recommended Diet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentDisease.diet.map((item, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                          <span className="bg-primary/20 p-1 rounded-full text-primary mr-2">
                            <Utensils className="h-4 w-4" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="treatment" className="space-y-4">
                    <h3 className="text-lg font-medium">Treatment Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentDisease.treatments.map((item, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                          <span className="bg-primary/20 p-1 rounded-full text-primary mr-2">
                            <Pill className="h-4 w-4" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <h3 className="text-lg font-medium">Educational Resources</h3>
                    {currentDisease.resources && currentDisease.resources.length > 0 ? (
                      <div className="space-y-3">
                        {currentDisease.resources.map((resource, index) => (
                          <a 
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Book className="h-4 w-4 text-primary" />
                              <span>{resource.title}</span>
                            </div>
                            <Badge variant="outline">{resource.type}</Badge>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No resources available for this condition.</p>
                    )}
                    
                    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                        Disclaimer
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The information provided is for educational purposes only and is not a substitute for professional medical advice. 
                        Always consult with a qualified healthcare provider for diagnosis and treatment.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Last updated: April 30, 2025</span>
                </div>
                
                <Button variant="ghost" size="sm">
                  Report Inaccuracy
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Health Tracking</CardTitle>
                  <CardDescription>Monitor symptoms and track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isAuthenticated ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="h-24 flex-col">
                            <Activity className="h-6 w-6 mb-2" />
                            <span>Log Symptoms</span>
                          </Button>
                          <Button variant="outline" className="h-24 flex-col">
                            <Pill className="h-6 w-6 mb-2" />
                            <span>Medication Tracker</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Track your symptoms, medications, and health metrics to get personalized insights and management tips.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sign up or log in to access personalized health tracking features, including symptom journals, medication reminders, and health trends.
                        </p>
                        <div className="flex gap-2">
                          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                            Login to Track Health
                          </a>
                          <a href="/signup" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md text-sm">
                            Sign Up
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiseaseManagement;
