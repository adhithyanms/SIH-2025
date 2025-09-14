import React, { useState } from 'react';
import { useBus } from '../../contexts/BusContext';
import { Search, MapPin, Clock, Users, Navigation } from 'lucide-react';
import BusList from './BusList';
import BusMapView from './BusMapView';

const PassengerDashboard: React.FC = () => {
  const [searchType, setSearchType] = useState<'route' | 'stops'>('route');
  const [routeNumber, setRouteNumber] = useState('');
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { buses, routes } = useBus();

  const searchBuses = () => {
    if (searchType === 'route' && routeNumber) {
      return buses.filter(bus => bus.routeNumber === routeNumber);
    }
    if (searchType === 'stops' && fromStop && toStop) {
      const validRoutes = routes.filter(route => {
        const stopNames = route.stops.map(stop => stop.name);
        const fromIndex = stopNames.indexOf(fromStop);
        const toIndex = stopNames.indexOf(toStop);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      });
      return buses.filter(bus =>
        validRoutes.some(route => route.routeNumber === bus.routeNumber)
      );
    }
    return [];
  };

  const searchResults = searchBuses();
 
  const allStops = Array.from(new Set(routes.flatMap(route => route.stops.map(stop => stop.name))));
  
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName = data.address?.road || data.display_name || 'Current Location';
          setFromStop(locationName);
        } catch (error) {
          console.error(error);
          setFromStop('Current Location');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        alert('Unable to retrieve your location');
        setLoadingLocation(false);
      }
    );
  };

  if (selectedBusId) {
    const bus = buses.find(b => b._id === selectedBusId || b.id === selectedBusId);
    const route = routes.find(r => r.routeNumber === bus?.routeNumber);
    if (bus && route) {
      return (
        <div className="min-h-screen bg-gray-50">
          <BusMapView bus={bus} route={route} onBack={() => setSelectedBusId(null)} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Bus</h2>
            <p className="text-gray-600">Search by route number or journey stops</p>
          </div>

          {/* Search Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 max-w-md mx-auto">
            <button
              onClick={() => setSearchType('route')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                searchType === 'route' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              By Route
            </button>
            <button
              onClick={() => setSearchType('stops')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                searchType === 'stops' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              By Stops
            </button>
          </div>

          {/* Search Forms */}
          {searchType === 'route' ? (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Number</label>
              <input
                type="text"
                value={routeNumber}
                onChange={e => setRouteNumber(e.target.value)}
                placeholder="Enter route number (e.g., 101)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" /> From Stop
                </label>
                <div className="flex gap-2">
                  <select
                    value={fromStop}
                    onChange={e => setFromStop(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select starting point</option>
                    {allStops.map(stop => (
                      <option key={stop} value={stop}>{stop}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleUseCurrentLocation}
                    className="px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                    style={{ minHeight: '48px' }}
                  >
                    {loadingLocation ? 'Locating...' : 'Use Current Location'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" /> To Stop
                </label>
                <select
                  value={toStop}
                  onChange={e => setToStop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={!fromStop}
                >
                  <option value="">Select destination</option>
                  {allStops.filter(stop => stop !== fromStop).map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {searchResults.length > 0 ? (
          <BusList buses={searchResults} onSelectBus={setSelectedBusId} />
        ) : (routeNumber || (fromStop && toStop)) ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No buses found</h3>
              <p>Try searching for a different route or stops combination.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Routes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map(route => (
                <div
                  key={route.id}
                  onClick={() => setRouteNumber(route.routeNumber)}
                  className="border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">#{route.routeNumber}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      buses.some(bus => bus.routeNumber === route.routeNumber && bus.isActive)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{route.routeName}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{route.stops.length} stops</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> ~45 mins
                    </span>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-gray-500">Route:</div>
                    <div className="text-sm text-gray-700">
                      {route.stops[0]?.name} → {route.stops[route.stops.length - 1]?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerDashboard;
