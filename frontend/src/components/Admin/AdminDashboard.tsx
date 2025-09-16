import React, { useState } from "react";
import { useBus } from "../../contexts/BusContext";
import {
  BarChart3,
  Bus,
  Users,
  Route,
  AlertTriangle,
  Settings,
  MapPin,
} from "lucide-react";

import SystemOverview from "./SystemOverview";
import BusMonitoring from "./BusMonitoring";
import RouteManagement from "./RouteManagement";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import Access from "./Access"; // 👈 new component
import BusStopDisplay from "./BusStopDisplay"; // ✅ new component

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "buses" | "routes" | "users" | "access" | "analytics" | "bus-stops"
  >("overview");

  const { buses } = useBus();

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "buses" as const, label: "Bus Monitoring", icon: <Bus className="w-5 h-5" /> },
    { id: "routes" as const, label: "Route Management", icon: <Route className="w-5 h-5" /> },
    { id: "users" as const, label: "User Management", icon: <Users className="w-5 h-5" /> },
    { id: "access" as const, label: "Access", icon: <Settings className="w-5 h-5" /> },
    { id: "analytics" as const, label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "bus-stops" as const, label: "Bus Stops", icon: <MapPin className="w-5 h-5" /> }, // ✅ new tab
  ];

  // Calculate stats
  const activeBuses = buses.filter((bus) => bus.isActive).length;
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.passengerCount, 0);
  const alerts = buses.filter((bus) => bus.crowdLevel === "high").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-3xl font-bold text-gray-900">{activeBuses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bus className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                <p className="text-3xl font-bold text-gray-900">{totalPassengers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Routes</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Route className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Crowd Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{alerts}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && <SystemOverview />}
            {activeTab === "buses" && <BusMonitoring />}
            {activeTab === "routes" && <RouteManagement />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "access" && <Access />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "bus-stops" && <BusStopDisplay />} {/* ✅ new content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;