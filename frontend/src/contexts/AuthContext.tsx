import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

 const sendOTP = async (phoneNumber: string) => {
  setIsLoading(true);
  try {
    const res = await apiService.sendOTP(phoneNumber);
    return res; // ✅ return response with OTP
  } finally {
    setIsLoading(false);
  }
};


  const login = async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiService.verifyOTP(phoneNumber, otp);
      const userData = response.user;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, sendOTP, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};