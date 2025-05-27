import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Calendar, Dumbbell, Utensils, Pill, Building, ArrowRight } from 'lucide-react';



import { Button } from '../components/ui/button';


const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1 rounded-md">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">HealthDesk</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Dashboard</Link>
              <Link to="/healthdesk-ai" className="text-gray-600 hover:text-primary-600 transition-colors">AI Assistant</Link>
              <Link to="/recommend-hospital" className="text-gray-600 hover:text-primary-600 transition-colors">Find Hospitals</Link>
              <Link to="/health-tools" className="text-gray-600 hover:text-primary-600 transition-colors">Health Tools</Link>
              <Link to="/community" className="text-gray-600 hover:text-primary-600 transition-colors">Community</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>








      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Complete <span className="gradient-text">Health Management</span> Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track diseases, manage medications, plan your diet, monitor fitness, and access powerful health tools - all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/healthdesk-ai">
                <Button size="lg" variant="outline" className="px-8">
                  Try HealthDesk AI
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-5xl animate-float">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="HealthDesk Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-pulse-soft">
              <div className="flex items-center gap-3">
                <div className="bg-healthGreen-500 p-2 rounded-full text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-sm">Health Score</p>
                  <p className="text-healthGreen-600 font-bold">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Comprehensive Health Management Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
                <Activity className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Disease Management</h3>
              <p className="text-gray-600 mb-4">
                Track symptoms, medications, and progress for chronic conditions with personalized care plans.
              </p>
              <Link to="/disease-management" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-healthGreen-100 p-3 rounded-lg w-fit mb-4">
                <Heart className="h-6 w-6 text-healthGreen-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Preventive Healthcare</h3>
              <p className="text-gray-600 mb-4">
                Stay ahead with preventive care recommendations, screenings, and health check reminders.
              </p>
              <Link to="/preventive-healthcare" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expiry Tracker</h3>
              <p className="text-gray-600 mb-4">
                Never miss an expiration date with our medication and supplements expiry tracker.
              </p>
              <Link to="/expiry-tracker" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Dumbbell className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Yoga & Fitness</h3>
              <p className="text-gray-600 mb-4">
                Access yoga routines, workout plans, and track your fitness progress all in one place.
              </p>
              <Link to="/yogafitness" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4">
                <Utensils className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diet Planner</h3>
              <p className="text-gray-600 mb-4">
                Create personalized diet plans based on your health conditions, goals and dietary restrictions.
              </p>
              <Link to="/diet-planner" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="feature-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-rose-100 p-3 rounded-lg w-fit mb-4">
                <Pill className="h-6 w-6 text-rose-600" />









              </div>
              <h3 className="text-xl font-semibold mb-2">Health Tools</h3>
              <p className="text-gray-600 mb-4">
                Utilize our BMI calculator, health risk assessments, and other essential health tools.
              </p>
              <Link to="/health-tools" className="text-primary-600 font-medium inline-flex items-center">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="mb-6">
                <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm mb-4">
                  POWERED BY AI
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Meet HealthDesk AI -<br />Your Health Intelligence Assistant
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Advanced AI technology that helps you with appointments, symptom analysis, and medical document understanding.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                      <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">AI Appointment Scheduling</p>
                      <p className="text-gray-600 text-sm">Let AI find the best appointment times based on your schedule</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                      <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Symptom Analysis</p>
                      <p className="text-gray-600 text-sm">Identify possible conditions based on your reported symptoms</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                      <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Medical Report Analysis</p>
                      <p className="text-gray-600 text-sm">Get easy-to-understand explanations of your medical reports</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/healthdesk-ai">
                    <Button size="lg">
                      Try HealthDesk AI
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-500 blur-3xl opacity-20 rounded-full" />
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border">
                  <div className="p-6 border-b bg-gray-50">
                    <h3 className="font-semibold">HealthDesk AI Assistant</h3>
                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Hello! I'm your HealthDesk AI assistant. How can I help you today?</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-end gap-3">
                      <div className="bg-primary-600 text-white rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">I've been having headaches and a mild fever for the past two days.</p>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5.001 5.001 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">I understand you're experiencing headaches and a mild fever. Let me ask a few questions to better understand your symptoms.</p>
                        <p className="text-sm mt-2">Have you noticed any other symptoms like sore throat, cough, body aches, or sensitivity to light?</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-end gap-3">
                      <div className="bg-primary-600 text-white rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Yes, I also have some body aches and slight sensitivity to light.</p>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5.001 5.001 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Based on your symptoms, you might be experiencing a common viral infection or possibly a migraine. Here are some possible conditions to discuss with your doctor:</p>
                        <ul className="list-disc pl-5 mt-2 text-sm">
                          <li>Viral fever</li>
                          <li>Early flu symptoms</li>
                          <li>Migraine</li>
                        </ul>
                        <p className="mt-2 text-sm">Would you like me to help you find a doctor or recommend some home care measures?</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Type your symptoms or questions..."
                        className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Finder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2">
              <span className="inline-block py-1 px-3 rounded-full bg-healthGreen-100 text-healthGreen-600 font-semibold text-sm mb-4">
                FIND CARE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find the Right Hospital<br />Based on Your Needs
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Discover hospitals and healthcare facilities near you, filtered by specialization and ratings.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-healthGreen-100 p-1 rounded-full">
                    <svg className="h-5 w-5 text-healthGreen-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Location-Based Search</p>
                    <p className="text-gray-600 text-sm">Find healthcare facilities in your area or any location</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-healthGreen-100 p-1 rounded-full">
                    <svg className="h-5 w-5 text-healthGreen-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Specialization Filters</p>
                    <p className="text-gray-600 text-sm">Find hospitals based on medical specialties and services</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-healthGreen-100 p-1 rounded-full">
                    <svg className="h-5 w-5 text-healthGreen-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Patient Reviews</p>
                    <p className="text-gray-600 text-sm">See ratings and reviews from other patients</p>
                  </div>
                </li>
              </ul>
              <Link to="/recommend-hospital">
                <Button variant="outline" size="lg">
                  Find Hospitals Near You
                  <Building className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-healthGreen-100 to-blue-100 rounded-xl" style={{ zIndex: -1 }}></div>
                <img
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                  alt="Hospital building"
                  className="rounded-xl shadow-lg w-full object-cover h-[400px]"
                />
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-healthGreen-600" />
                    <div>
                      <p className="font-medium text-sm">250+ Hospitals</p>
                      <p className="text-xs text-gray-500">In your area</p>
                    </div>
                  </div>


                </div>






              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Health Journey Today
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join HealthDesk and take control of your health with our comprehensive tools and personalized insights.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-primary-600 text-white p-1 rounded-md">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="font-bold text-xl">HealthDesk</span>
              </Link>
              <p className="text-gray-600">
                Your complete health management platform. Track, manage, and improve your health journey.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/disease-management" className="text-gray-600 hover:text-primary-600">
                    Disease Management
                  </Link>
                </li>
                <li>
                  <Link to="/preventive-healthcare" className="text-gray-600 hover:text-primary-600">
                    Preventive Healthcare
                  </Link>
                </li>
                <li>
                  <Link to="/expiry-tracker" className="text-gray-600 hover:text-primary-600">
                    Expiry Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/yogafitness" className="text-gray-600 hover:text-primary-600">
                    Yoga & Fitness
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-gray-600 hover:text-primary-600">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-600 hover:text-primary-600">
                    Career
                  </Link>
                </li>
                {/* <li>
                <Link to="/tech-details" className="text-gray-600 hover:text-primary-600">
                  Tech Details
                </Link>
              </li> */}
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-primary-600">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/diet-planner" className="text-gray-600 hover:text-primary-600">
                    Diet Planner
                  </Link>
                </li>
                <li>
                  <Link to="/health-tools" className="text-gray-600 hover:text-primary-600">
                    BMI Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/healthdesk-ai" className="text-gray-600 hover:text-primary-600">
                    HealthDesk AI
                  </Link>
                </li>
                <li>
                  <Link to="/recommend-hospital" className="text-gray-600 hover:text-primary-600">
                    Hospital Finder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">support@healthdesk.com</li>
                <li className="text-gray-600">+91 (555) 123-4567</li>
                <li className="text-gray-600">
                  Hackdiwas<br />
                  United University<br />
                  Rawatpur, Prayagraj
                </li>
              </ul>
              <div className="mt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184c-.897-1.562-2.178-2.54-3.594-2.54-2.719 0-4.924 2.205-4.924 4.924 0 .39.044.765.126 1.124A13.936 13.936 0 013.19 3.424a4.9 4.9 0 001.523 6.57 4.88 4.88 0 01-2.23-.616v.06c0 2.386 1.693 4.375 3.946 4.827a4.936 4.936 0 01-2.212.085 4.92 4.92 0 004.604 3.417 9.863 9.863 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HealthDesk. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 text-sm">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;