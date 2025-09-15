import React, { createContext, useContext, useState, useEffect } from "react";
import { Bus, Route } from "../types";
import apiService from "../services/api";

interface BusContextType {
  buses: Bus[];
  routes: Route[];
  totalTickets: number;
  addTicket: (toStop?: string, count?: number) => void;
  getStopSummary: (conductorId: string, routeNumber: string) => Promise<{ total: number; byStop: { toStop: string; count: number }[] }>;
  completeStop: (conductorId: string, routeNumber: string, stopName: string) => Promise<{ impactedCount: number }>;
  updateBusLocation: (busId: string, location: { lat: number; lng: number }) => Promise<void>;
  updateCrowdLevel: (busId: string, level: "low" | "medium" | "high") => Promise<void>;
  adjustPassengerCount: (busId: string, delta: number) => Promise<void>;
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
  const [perStopTickets, setPerStopTickets] = useState<Record<string, number>>({});
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

  const addTicket = (toStop?: string, count: number = 1) => {
    setTotalTickets((prev) => prev + count);
    if (toStop) {
      setPerStopTickets((prev) => ({ ...prev, [toStop]: (prev[toStop] || 0) + count }));
    }
  };

  const getStopSummary = async (conductorId: string, routeNumber: string) => {
    const res = await apiService.getStopSummary(conductorId, routeNumber);
    const map: Record<string, number> = {};
    (res.byStop || []).forEach((row: any) => { map[row.toStop] = row.count; });
    setPerStopTickets(map);
    setTotalTickets(res.total || 0);
    return res;
  };

  const completeStop = async (conductorId: string, routeNumber: string, stopName: string) => {
    const res = await apiService.completeStop(conductorId, routeNumber, stopName);
    const impacted = res.impactedCount || 0;
    if (impacted > 0) {
      setTotalTickets((prev) => Math.max(0, prev - impacted));
      setPerStopTickets((prev) => ({ ...prev, [stopName]: Math.max(0, (prev[stopName] || 0) - impacted) }));
    }
    return { impactedCount: impacted };
  };

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

  const adjustPassengerCount = async (busId: string, delta: number) => {
    const target = buses.find(b => b.id === busId);
    const current = target?.passengerCount || 0;
    const next = Math.max(0, current + delta);
    try {
      await apiService.updatePassengerCount(busId, next);
      setBuses((prev) => prev.map(b => b.id === busId ? { ...b, passengerCount: next } : b));
    } catch (error) {
      console.error('Failed to adjust passenger count:', error);
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
        getStopSummary,
        completeStop,
        updateBusLocation,
        updateCrowdLevel,
        adjustPassengerCount,
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
