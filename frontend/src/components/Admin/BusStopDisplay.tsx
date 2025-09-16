import React, { useEffect, useState } from "react";
import apiService from "../../services/api";

interface BusType {
  id: string;
  routeNumber: string;
  currentStop: string;
  estimatedArrival: string;
  crowdLevel: "low" | "medium" | "high";
  isActive: boolean;
}

interface Stop {
  stopId: string;
  name: string;
}

interface RouteType {
  routeNumber: string;
  stops: Stop[];
}

const crowdColorMap: Record<string, string> = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-red-600",
};

const BusStopDisplayBoard: React.FC = () => {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, routeRes] = await Promise.all([
          apiService.getAllBuses(),
          fetch("http://localhost:5000/api/routes").then((res) => res.json()),
        ]);

        setBuses(busRes.buses || []);
        setRoutes(routeRes.routes || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  // Filter buses based on search input
  const filteredBuses = buses.filter((bus) => {
    const route = routes.find((r) => r.routeNumber === bus.routeNumber);
    const nextStop =
      route &&
      (() => {
        const currentIndex = route.stops.findIndex((s) => s.name === bus.currentStop);
        if (currentIndex >= 0 && currentIndex + 1 < route.stops.length) {
          return route.stops[currentIndex + 1].name;
        } else if (route?.stops.length) return route.stops[0].name;
        return "";
      })();

    return (
      bus.routeNumber.toLowerCase().includes(search.toLowerCase()) ||
      bus.currentStop.toLowerCase().includes(search.toLowerCase()) ||
      (nextStop && nextStop.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Bus Arrival Board</h2>

      {/* Search */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by Route or Stop"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Header */}
      <div className="grid grid-cols-6 gap-4 items-center font-mono text-sm border-b border-gray-300 py-2 uppercase bg-gray-100">
        <div className="font-semibold">Route</div>
        <div className="font-semibold">Current Stop</div>
        <div className="font-semibold">Next Stop</div>
        <div className="font-semibold">ETA</div>
        <div className="font-semibold">Crowd</div>
        <div className="font-semibold">Status</div>
      </div>

      {/* Rows */}
      {filteredBuses.map((bus) => {
        const route = routes.find((r) => r.routeNumber === bus.routeNumber);

        let nextStopName = bus.currentStop;
        if (route) {
          const currentIndex = route.stops.findIndex((s) => s.name === bus.currentStop);
          if (currentIndex >= 0 && currentIndex + 1 < route.stops.length) {
            nextStopName = route.stops[currentIndex + 1].name;
          } else if (route.stops.length > 0) {
            nextStopName = route.stops[0].name; // loop back if last stop
          }
        }

        return (
          <div
            key={bus.id}
            className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 py-2 hover:bg-gray-50 transition-colors"
          >
            <div>{bus.routeNumber}</div>
            <div>{bus.currentStop}</div>
            <div>{nextStopName}</div>
            <div>{bus.estimatedArrival}</div>
            <div className={`font-semibold ${crowdColorMap[bus.crowdLevel]}`}>
              {bus.crowdLevel.toUpperCase()}
            </div>
            <div>{bus.isActive ? "ACTIVE" : "INACTIVE"}</div>
          </div>
        );
      })}

      {filteredBuses.length === 0 && (
        <div className="text-center py-10 text-gray-400">No buses found</div>
      )}
    </div>
  );
};

export default BusStopDisplayBoard;