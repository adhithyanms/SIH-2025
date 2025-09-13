import React, { useEffect, useState } from 'react';
import { Bus, MapPin, Users, AlertTriangle, Clock, Filter } from 'lucide-react';
import apiService from '../../services/api'; // 👈 Import your API service

interface BusType {
  id: string;
  routeNumber: string;
  currentStop: string;
  nextStop: string;
  currentLocation: { lat: number; lng: number };
  crowdLevel: 'low' | 'medium' | 'high';
  passengerCount: number;
  maxCapacity: number;
  estimatedArrival: string;
  isActive: boolean;
}

const BusMonitoring: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'high-crowd' | 'delayed'>('all');
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch buses from backend
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await apiService.getAllBuses();
        // API returns { buses: [...] }, so we access res.buses
        setBuses(res.buses || []);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
    // Optional: Auto refresh every 30s
    const interval = setInterval(fetchBuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredBuses = () => {
    switch (filter) {
      case 'active':
        return buses.filter(bus => bus.isActive);
      case 'high-crowd':
        return buses.filter(bus => bus.crowdLevel === 'high');
      case 'delayed':
        return buses.filter(bus => bus.estimatedArrival?.toLowerCase().includes('delayed'));
      default:
        return buses;
    }
  };

  const filteredBuses = getFilteredBuses();

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading buses...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Bus Fleet Monitoring</h3>
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Buses ({buses.length})</option>
            <option value="active">Active Only ({buses.filter(b => b.isActive).length})</option>
            <option value="high-crowd">High Crowd ({buses.filter(b => b.crowdLevel === 'high').length})</option>
            <option value="delayed">Delayed ({buses.filter(b => b.estimatedArrival?.toLowerCase().includes('delayed')).length})</option>
          </select>
        </div>
      </div>

      {/* Bus Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredBuses.map((bus) => (
          <div key={bus.id || bus._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${bus.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Route #{bus.routeNumber}</h4>
                  <p className="text-sm text-gray-600">Bus ID: {bus.id || bus._id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrowdColor(bus.crowdLevel)}`}>
                  {bus.crowdLevel} crowd
                </span>
                {!bus.isActive && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Current Stop
                </div>
                <div className="font-medium text-gray-900">{bus.currentStop}</div>
              </div>

              <div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Next Stop ETA
                </div>
                <div className="font-medium text-gray-900">{bus.estimatedArrival}</div>
              </div>

              <div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Passengers
                </div>
                <div className="font-medium text-gray-900">
                  {bus.passengerCount}/{bus.maxCapacity}
                </div>
              </div>

              <div>
                <div className="flex items-center text-gray-600 text-sm">
                  GPS Location
                </div>
                <div className="text-xs text-gray-600">
                  {bus.currentLocation?.lat.toFixed(4)}, {bus.currentLocation?.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Passenger Load Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Passenger Load</span>
                <span>{Math.round((bus.passengerCount / bus.maxCapacity) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    bus.passengerCount / bus.maxCapacity < 0.5
                      ? 'bg-green-500'
                      : bus.passengerCount / bus.maxCapacity < 0.8
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${(bus.passengerCount / bus.maxCapacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View Details
              </button>
              {bus.crowdLevel === 'high' && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Requires Attention
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBuses.length === 0 && (
        <div className="text-center py-12">
          <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BusMonitoring;
