import React, { useState } from 'react';
import { useBus } from '../../contexts/BusContext';
import { useAuth } from '../../contexts/AuthContext';
import { Bus, Users, MapPin, AlertTriangle, Ticket, Navigation } from 'lucide-react';
import TicketMachine from './TicketMachine';
import RouteTracker from './RouteTracker';
import EmergencyAlert from './EmergencyAlert';

const ConductorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'route' | 'emergency'>('tickets');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const { buses, routes, updateCrowdLevel } = useBus();
  const { user } = useAuth();

  const conductorBus = buses.find(bus => bus.conductorId === user?.id);
  React.useEffect(() => {
    if (user?.assignedRouteNumber) {
      setSelectedRoute(user.assignedRouteNumber);
    }
  }, [user?.assignedRouteNumber]);
  const currentRoute = routes.find(route => route.routeNumber === selectedRoute);

  const tabs = [
    { id: 'tickets' as const, label: 'Ticket Machine', icon: <Ticket className="w-5 h-5" /> },
    { id: 'route' as const, label: 'Route Tracker', icon: <Navigation className="w-5 h-5" /> },
    { id: 'emergency' as const, label: 'Emergency', icon: <AlertTriangle className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedRoute ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <Bus className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Route</h2>
              <p className="text-gray-600">Choose the route you're conducting today</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.routeNumber)}
                  className="border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">#{route.routeNumber}</span>
                    <Bus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{route.routeName}</h3>
                  <p className="text-sm text-gray-600 mb-4">{route.stops.length} stops</p>
                  
                  <div className="space-y-1">
                    {route.stops.slice(0, 3).map((stop, index) => (
                      <div key={stop.id} className="flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                        {stop.name}
                      </div>
                    ))}
                    {route.stops.length > 3 && (
                      <div className="text-sm text-gray-400 ml-5">
                        +{route.stops.length - 3} more stops
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Route Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bus className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Route #{selectedRoute}</h2>
                    <p className="text-gray-600">{currentRoute?.routeName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoute('')}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Change Route
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {conductorBus?.passengerCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Current Passengers</div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <MapPin className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-xl font-bold text-gray-900">
                    {conductorBus?.currentStop || 'Not Set'}
                  </div>
                  <div className="text-sm text-gray-600">Current Stop</div>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-4">
                  <Navigation className="w-8 h-8 text-yellow-600 mb-2" />
                  <div className="text-xl font-bold text-gray-900">
                    {conductorBus?.nextStop || 'Not Set'}
                  </div>
                  <div className="text-sm text-gray-600">Next Stop</div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className={`w-8 h-8 rounded-full mb-2 ${
                    conductorBus?.crowdLevel === 'low' ? 'bg-green-500' :
                    conductorBus?.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-xl font-bold text-gray-900 capitalize">
                    {conductorBus?.crowdLevel || 'Low'}
                  </div>
                  <div className="text-sm text-gray-600">Crowd Level</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-t-2xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'tickets' && (
                  <TicketMachine routeNumber={selectedRoute} />
                )}
                {activeTab === 'route' && currentRoute && (
                  <RouteTracker route={currentRoute} busId={conductorBus?.id || ''} />
                )}
                {activeTab === 'emergency' && (
                  <EmergencyAlert busId={conductorBus?.id || ''} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConductorDashboard;