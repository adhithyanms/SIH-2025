import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BusProvider } from './contexts/BusContext';
import Header from './components/Layout/Header';
import RoleSelection from './components/Home/RoleSelection';
import Login from './components/Auth/Login';
import ConductorDashboard from './components/Conductor/ConductorDashboard';
import PassengerDashboard from './components/Passenger/PassengerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'conductor' | 'passenger' | 'admin' | null>(null);
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

  // If role is selected but not logged in, show login
  if (selectedRole) {
    return (
      <Login 
        role={selectedRole} 
        onBack={() => setSelectedRole(null)} 
      />
    );
  }

  // Show role selection
  return <RoleSelection onRoleSelect={setSelectedRole} />;
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