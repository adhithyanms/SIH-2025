import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BusProvider } from './contexts/BusContext';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import ConductorDashboard from './components/Conductor/ConductorDashboard';
import PassengerDashboard from './components/Passenger/PassengerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // If user is logged in, show their dashboard
  if (user) {
    return (
      <>
        <Header />
        {user.role === 'conductor' && <ConductorDashboard />}
        {user.role === 'passenger' && <PassengerDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </>
    );
  }

  // Show single login when logged out
  return <Login />;
};

function App() {
  return (
    <AuthProvider>
      <BusProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </BusProvider>
    </AuthProvider>
  );
}

export default App;