import React from 'react';
import { Bus, User, Shield } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'conductor' | 'passenger' | 'admin') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const roles = [
    {
      id: 'conductor' as const,
      title: 'Conductor',
      description: 'Manage tickets, track routes, and handle passenger information',
      icon: <Bus className="w-12 h-12" />,
      color: 'blue',
      features: ['Digital Ticket Generation', 'Route Management', 'Passenger Count Tracking', 'Emergency Alerts']
    },
    {
      id: 'passenger' as const,
      title: 'Passenger',
      description: 'Find buses, check real-time locations, and plan your journey',
      icon: <User className="w-12 h-12" />,
      color: 'green',
      features: ['Real-time Bus Tracking', 'Route Information', 'Arrival Predictions', 'Crowd Levels']
    },
    {
      id: 'admin' as const,
      title: 'Admin',
      description: 'Monitor system, manage routes, and analyze transportation data',
      icon: <Shield className="w-12 h-12" />,
      color: 'purple',
      features: ['System Monitoring', 'Route Management', 'User Management', 'Analytics & Reports']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BusTrack Pro</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            Real-time Bus Tracking System for Tier-2 Cities
          </p>
          <p className="text-gray-500">
            Choose your role to get started with our comprehensive transportation management platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 p-8"
            >
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-full bg-${role.color}-100 text-${role.color}-600 mb-4 group-hover:bg-${role.color}-600 group-hover:text-white transition-colors`}>
                  {role.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${role.color}-500`}></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 px-6 bg-${role.color}-600 text-white rounded-lg hover:bg-${role.color}-700 transition-colors font-medium group-hover:bg-${role.color}-700`}>
                Continue as {role.title}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">For Cities & Transportation</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Low-cost GPS-based real-time tracking</li>
                <li>• Crowd level monitoring and management</li>
                <li>• Emergency alert system</li>
                <li>• Route optimization analytics</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Technical Advantages</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Progressive Web App (works offline)</li>
                <li>• Optimized for low-bandwidth environments</li>
                <li>• Cross-platform compatibility</li>
                <li>• Secure OTP-based authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;