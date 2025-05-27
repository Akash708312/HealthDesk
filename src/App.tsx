
import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Import pages
import DietPlanner from './pages/DietPlanner';
import RecommendHospital from './pages/RecommendHospital';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import PreventiveHealthcare from './pages/PreventiveHealthcare';
import YogaFitness from './pages/YogaFitness';
import ExpiryTracker from './pages/ExpiryTracker';
import DiseaseManagement from './pages/DiseaseManagement';
import HealthTools from './pages/HealthTools';
import HealthdeskAI from './pages/HealthdeskAI';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Careers from './pages/Careers';
import Community from './pages/Community';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { Toaster } from 'sonner';


function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Protected routes that require authentication */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/diet-planner" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
        <Route path="/preventive-healthcare" element={<ProtectedRoute><PreventiveHealthcare /></ProtectedRoute>} />
        <Route path="/expiry-tracker" element={<ProtectedRoute><ExpiryTracker /></ProtectedRoute>} />
        <Route path="/disease-management" element={<ProtectedRoute><DiseaseManagement /></ProtectedRoute>} />
        <Route path="/recommend-hospital" element={<ProtectedRoute><RecommendHospital /></ProtectedRoute>} />
        <Route path="/health-tools" element={<ProtectedRoute><HealthTools /></ProtectedRoute>} />
        <Route path="/healthdesk-ai" element={<ProtectedRoute><HealthdeskAI /></ProtectedRoute>} />
        <Route path="/yogafitness" element={<ProtectedRoute><YogaFitness /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        
        {/* Admin protected route */}
        <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
