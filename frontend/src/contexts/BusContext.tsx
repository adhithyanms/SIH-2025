import React, { createContext, useContext, useState, useEffect } from "react";
import { Bus, Route } from "../types";
import apiService from "../services/api";

interface BusContextType {
  buses: Bus[];
  routes: Route[];
  totalTickets: number;
  addTicket: () => void;
  updateBusLocation: (busId: string, location: { lat: number; lng: number }) => Promise<void>;
  updateCrowdLevel: (busId: string, level: "low" | "medium" | "high") => Promise<void>;
  getBusByRoute: (routeNumber: string) => Bus[];
  refreshBuses: () => Promise<void>;
  refreshRoutes: () => Promise<void>;
  isLoading: boolean;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

export const useBus = () => {
  const context = useContext(BusContext);
  if (context === undefined) {
    throw new Error("useBus must be used within a BusProvider");
  }
  return context;
};

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshBuses();
    refreshRoutes();
  }, []);

  // Simulate real-time updates (bus movement) - only for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          currentLocation: {
            lat: bus.currentLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.currentLocation.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshBuses = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllBuses();
      setBuses(response.buses);
    } catch (error) {
      console.error('Failed to fetch buses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRoutes = async () => {
    try {
      const response = await apiService.getAllRoutes();
      setRoutes(response.routes);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    }
  };

  const addTicket = () => setTotalTickets((prev) => prev + 1);

  const updateBusLocation = async (busId: string, location: { lat: number; lng: number }) => {
    try {
      await apiService.updateBusLocation(busId, location.lat, location.lng);
      setBuses((prev) =>
        prev.map((bus) => (bus.id === busId ? { ...bus, currentLocation: location } : bus))
      );
    } catch (error) {
      console.error('Failed to update bus location:', error);
      throw error;
    }
  };

  const updateCrowdLevel = async (busId: string, level: "low" | "medium" | "high") => {
    try {
      await apiService.updateCrowdLevel(busId, level);
      setBuses((prev) =>
        prev.map((bus) => (bus.id === busId ? { ...bus, crowdLevel: level } : bus))
      );
    } catch (error) {
      console.error('Failed to update crowd level:', error);
      throw error;
    }
  };

  const getBusByRoute = (routeNumber: string) => {
    return buses.filter((bus) => bus.routeNumber === routeNumber);
  };

  return (
    <BusContext.Provider
      value={{
        buses,
        routes,
        totalTickets,
        addTicket,
        updateBusLocation,
        updateCrowdLevel,
        getBusByRoute,
        refreshBuses,
        refreshRoutes,
        isLoading,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};
