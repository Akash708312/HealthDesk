
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoadingSpinner from './LoadingSpinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAdminAuthenticated, isInitialized, checkAdminAuth } = useAdminAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Only check authentication when the hook is initialized and component is mounted
    const verifyAuth = async () => {
      if (isInitialized && isMounted) {
        await checkAdminAuth();
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    verifyAuth();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isInitialized, checkAdminAuth]);

  if (!isInitialized || isChecking) {
    return <LoadingSpinner />;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
