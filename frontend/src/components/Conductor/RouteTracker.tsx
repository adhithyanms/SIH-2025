import React, { useState, useEffect } from "react";
import { Route } from "../../types";
import { MapPin, Navigation, CheckCircle, Ticket } from "lucide-react";
import { useBus } from "../../contexts/BusContext";
import { getDistanceFromLatLonInM } from "../../utils/distance";

interface RouteTrackerProps {
  route: Route;
}

const RouteTracker: React.FC<RouteTrackerProps> = ({ route }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const { totalTickets } = useBus();

  // 📌 GPS Tracking
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation not available in this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        let nearestIndex = currentStopIndex;
        let minDistance = Infinity;

        route.stops.forEach((stop, index) => {
          if (!stop.lat || !stop.lng) return;
          const distance = getDistanceFromLatLonInM(latitude, longitude, stop.lat, stop.lng);

          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });

        if (minDistance < 100 && nearestIndex !== currentStopIndex) {
          setCurrentStopIndex(nearestIndex);
          console.log(`Reached stop: ${route.stops[nearestIndex].name}`);
        }
      },
      (error) => console.error("GPS error:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [route, currentStopIndex]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Route Tracker</h3>
        <p className="text-gray-600">{route.routeName}</p>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Current Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Current Stop:</span>
            <div className="font-bold text-lg">{route.stops[currentStopIndex]?.name || "Not Started"}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Next Stop:</span>
            <div className="font-bold text-lg">{route.stops[currentStopIndex + 1]?.name || "End of Route"}</div>
          </div>
        </div>
      </div>

      {/* ✅ Total Tickets */}
      <div className="bg-green-50 rounded-xl p-6 flex items-center space-x-3">
        <Ticket className="w-6 h-6 text-green-600" />
        <span className="font-semibold text-gray-900">Total Tickets Issued: {totalTickets}</span>
      </div>

      {/* Route Stops */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Route Stops
        </h4>

        {route.stops.map((stop, index) => (
          <div
            key={stop.id}
            className={`border-2 rounded-xl p-4 transition-all ${
              index === currentStopIndex
                ? "border-blue-500 bg-blue-50"
                : index < currentStopIndex
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentStopIndex
                    ? "bg-blue-500 text-white"
                    : index < currentStopIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index < currentStopIndex ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">{stop.name}</h5>
                <p className="text-sm text-gray-600">Stop {index + 1} of {route.stops.length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Route Progress</h4>
        <div className="w-full bg-yellow-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStopIndex + 1) / route.stops.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          {currentStopIndex + 1} of {route.stops.length} stops completed
        </p>
      </div>
    </div>
  );
};

export default RouteTracker;

