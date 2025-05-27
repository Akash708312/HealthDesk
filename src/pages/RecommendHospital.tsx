
import React from 'react';
import PageLayout from '../components/PageLayout';
import HospitalFinder from '../components/HospitalFinder';
import SEO from '../components/SEO';

const RecommendHospital = () => {
  return (
    <PageLayout>
      <SEO 
        title="Find Hospitals | WRLDS Health" 
        description="Locate and explore hospitals near you based on your specific healthcare needs" 
      />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Hospital Finder</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Find the right healthcare facilities near you. Search by location, specialty, and ratings to make informed decisions about your healthcare.
        </p>
        
        <div className="max-w-6xl mx-auto">
          <HospitalFinder />
        </div>
      </div>
    </PageLayout>
  );
};

export default RecommendHospital;
