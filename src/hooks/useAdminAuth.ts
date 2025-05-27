
import { useState, useEffect, useCallback, useRef } from 'react';
import { adminLogin } from '@/services/adminService';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const authCheckedRef = useRef(false);

  // Initialize state from localStorage when the hook is first used
  useEffect(() => {
    if (authCheckedRef.current) return;
    
    const storedAdminId = localStorage.getItem('adminId');
    const storedIsAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');
    
    if (storedAdminId && storedIsAdminAuthenticated === 'true') {
      setIsAdminAuthenticated(true);
      setAdminId(storedAdminId);
    }
    
    setIsInitialized(true);
    authCheckedRef.current = true;
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      
      if (result.success && result.userId) {
        setIsAdminAuthenticated(true);
        setAdminId(result.userId);
        localStorage.setItem('adminId', result.userId);
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast.success('Admin login successful');
        return true;
      } else {
        toast.error(result.error || 'Admin login failed');
        return false;
      }
    } catch (error: any) {
      // Fallback for testing when database isn't set up
      console.info('admin_users table might not exist yet, falling back to sample admin data');
      if (email === "admin@example.com" && password === "admin123") {
        const sampleUserId = "sample-admin-id-123";
        setIsAdminAuthenticated(true);
        setAdminId(sampleUserId);
        localStorage.setItem('adminId', sampleUserId);
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast.success('Admin login successful (Sample Mode)');
        return true;
      }
      
      toast.error(`Error: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = (): void => {
    setIsAdminAuthenticated(false);
    setAdminId(null);
    localStorage.removeItem('adminId');
    localStorage.removeItem('isAdminAuthenticated');
    toast.success('Admin logged out successfully');
  };

  // Check if admin is already authenticated (e.g., on page refresh)
  const checkAdminAuth = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // If the hook is not initialized yet, resolve with current state
      if (!isInitialized) {
        resolve(isAdminAuthenticated);
        return;
      }
      
      // If already initialized, return current state
      const storedAdminId = localStorage.getItem('adminId');
      const storedIsAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');
      
      if (storedAdminId && storedIsAdminAuthenticated === 'true') {
        if (!isAdminAuthenticated) {
          setIsAdminAuthenticated(true);
          setAdminId(storedAdminId);
        }
        resolve(true);
        return;
      }
      
      resolve(false);
    });
  }, [isInitialized, isAdminAuthenticated]);

  return {
    isAdminAuthenticated,
    adminId,
    isLoading,
    isInitialized,
    loginAdmin,
    logoutAdmin,
    checkAdminAuth
  };
};
