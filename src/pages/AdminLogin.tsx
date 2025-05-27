
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { sampleAdminUsers } from '@/services/adminService';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  
  const { isAdminAuthenticated, isLoading, loginAdmin, checkAdminAuth, isInitialized } = useAdminAuth();

  useEffect(() => {
    // Only check authentication once when the hook is initialized
    const checkAuth = async () => {
      if (isInitialized && !authChecked) {
        try {
          const isAuthenticated = await checkAdminAuth();
          if (isAuthenticated) {
            navigate('/admin');
          }
          setAuthChecked(true);
        } catch (error) {
          console.error("Error checking admin authentication:", error);
          setAuthChecked(true);
        }
      }
    };
    
    checkAuth();
  }, [isInitialized, authChecked, navigate, checkAdminAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    const success = await loginAdmin(email, password);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 bg-primary-600 text-white p-3 rounded-full inline-flex">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
          
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-md mt-4">
            <p className="text-xs text-amber-800 font-medium">Sample Admin Accounts:</p>
            {sampleAdminUsers.map((admin, index) => (
              <p key={index} className="text-xs text-amber-700 mt-1">
                Email: {admin.email}, Password: {admin.password}
              </p>
            ))}
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              <Link to="/" className="text-primary-600 hover:underline font-medium">
                Return to Homepage
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
