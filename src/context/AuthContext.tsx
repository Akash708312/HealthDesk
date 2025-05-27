
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  gender?: string; // Add gender as an optional property
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);

        // If session exists, fetch user profile
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        // If session exists, fetch user profile
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message}`);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success('You have been logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    if (!user) throw new Error('User must be logged in to update profile');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refresh the profile data
      await fetchUserProfile(user.id);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      isAuthenticated, 
      isLoading, 
      login, 
      signup, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '../integrations/supabase/client';
// import { toast } from 'sonner';

// interface Profile {
//   id: string;
//   full_name: string;
//   avatar_url: string | null;
//   gender?: string;
//   phone_number?: string; // <-- NEW
// }

// interface AuthContextType {
//   user: User | null;
//   profile: Profile | null;
//   session: Session | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (fullName: string, email: string, password: string, phoneNumber: string) => Promise<void>; // <-- UPDATED
//   logout: () => Promise<void>;
//   updateProfile: (profile: Partial<Profile>) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, newSession) => {
//         setSession(newSession);
//         setUser(newSession?.user ?? null);
//         setIsAuthenticated(!!newSession);

//         if (newSession?.user) {
//           setTimeout(() => fetchUserProfile(newSession.user.id), 0);
//         } else {
//           setProfile(null);
//         }
//       }
//     );

//     const initializeAuth = async () => {
//       try {
//         setIsLoading(true);
//         const { data: { session: currentSession } } = await supabase.auth.getSession();

//         setSession(currentSession);
//         setUser(currentSession?.user ?? null);
//         setIsAuthenticated(!!currentSession);

//         if (currentSession?.user) {
//           await fetchUserProfile(currentSession.user.id);
//         }
//       } catch (error) {
//         console.error('Error initializing auth:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const fetchUserProfile = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('id, full_name, avatar_url, phone_number') // <-- INCLUDED
//         .eq('id', userId)
//         .single();

//       if (error) throw error;
//       if (data) setProfile(data);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   const login = async (email: string, password: string): Promise<void> => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) throw error;

//       toast.success('Login successful!');
//       navigate('/dashboard');
//     } catch (error: any) {
//       toast.error(`Login failed: ${error.message}`);
//       throw error;
//     }
//   };

//   const signup = async (
//     fullName: string,
//     email: string,
//     password: string,
//     phoneNumber: string // <-- ADDED
//   ): Promise<void> => {
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName,
//           },
//         },
//       });

//       if (error) throw error;

//       const user = data.user;
//       if (!user) throw new Error('User not created');

//       // Insert into profiles
//       const { error: insertError } = await supabase.from('profiles').insert({
//         id: user.id,
//         full_name: fullName,
//         email,
//         phone_number: phoneNumber, // <-- INSERT PHONE
//       });

//       if (insertError) throw insertError;

//       toast.success('Account created successfully! Please check your email for verification.');
//       navigate('/login');
//     } catch (error: any) {
//       toast.error(`Signup failed: ${error.message}`);
//       throw error;
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       setUser(null);
//       setProfile(null);
//       setSession(null);
//       setIsAuthenticated(false);

//       toast.success('You have been logged out successfully');
//       navigate('/login');
//     } catch (error: any) {
//       toast.error(`Logout failed: ${error.message}`);
//       throw error;
//     }
//   };

//   const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
//     if (!user) throw new Error('User must be logged in to update profile');

//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update(profileData)
//         .eq('id', user.id);

//       if (error) throw error;

//       await fetchUserProfile(user.id);
//       toast.success('Profile updated successfully!');
//     } catch (error: any) {
//       toast.error(`Failed to update profile: ${error.message}`);
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       profile,
//       session,
//       isAuthenticated,
//       isLoading,
//       login,
//       signup,
//       logout,
//       updateProfile
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
