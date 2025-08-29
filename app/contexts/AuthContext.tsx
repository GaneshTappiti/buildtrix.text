"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    email: "user@example.com",
    name: "Demo User"
  });
  const [loading, setLoading] = useState(false);

  // Mock authentication - in real app this would connect to Supabase Auth
  useEffect(() => {
    // For development, immediately set user without loading state
    // This prevents the black screen issue during initial render
    console.log("Auth initialized with demo user");
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: "1",
        email,
        name: "Demo User"
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Mock sign out
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock sign up
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: Date.now().toString(),
        email,
        name
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    signIn,
    signOut,
    signUp,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
