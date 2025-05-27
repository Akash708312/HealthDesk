
import React from 'react';
import PageLayout from '../components/PageLayout';
import DietPlannerModule from '../components/DietPlannerModule';
import SEO from '../components/SEO';

const DietPlanner = () => {
  return (
    <PageLayout>
      <SEO 
        title="Diet Planner | WRLDS Health" 
        description="Create personalized diet plans to meet your health and fitness goals" 
      />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Diet Planner</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Create personalized meal plans based on your health goals. Track your nutrition, manage your caloric intake, and develop healthier eating habits.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <DietPlannerModule />
        </div>
      </div>
    </PageLayout>
  );
};

export default DietPlanner;
