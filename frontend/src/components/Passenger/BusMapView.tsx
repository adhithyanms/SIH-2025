import React from 'react';
import { Bus, Route } from '../../types';
import { ArrowLeft, MapPin, Navigation, Clock, Users } from 'lucide-react';

interface BusMapViewProps {
  bus: Bus;
  route: Route;
  onBack: () => void;
}

const BusMapView: React.FC<BusMapViewProps> = ({ bus, route, onBack }) => {
  const currentStopIndex = route.stops.findIndex(stop => stop.name === bus.currentStop);
  const nextStopIndex = currentStopIndex + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">Route #{bus.routeNumber}</h1>
          <p className="text-gray-600">{route.routeName}</p>
        </div>
      </div>

      {/* Bus Status Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <MapPin className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-sm text-gray-600 mb-1">Current Stop</div>
          <div className="font-bold text-lg text-gray-900">{bus.currentStop}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Navigation className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-sm text-gray-600 mb-1">Next Stop</div>
          <div className="font-bold text-lg text-gray-900">{bus.nextStop}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Clock className="w-8 h-8 text-yellow-600 mb-3" />
          <div className="text-sm text-gray-600 mb-1">Estimated Arrival</div>
          <div className="font-bold text-lg text-green-600">{bus.estimatedArrival}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Users className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-sm text-gray-600 mb-1">Crowd Level</div>
          <div className={`font-bold text-lg capitalize ${
            bus.crowdLevel === 'low' ? 'text-green-600' :
            bus.crowdLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {bus.crowdLevel}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Location</h3>
          <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
            
            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 50 50 Q 200 100 350 200 Q 500 300 650 350"
                stroke="#3B82F6"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
              />
            </svg>

            {/* Bus Position */}
            <div className="absolute" style={{ top: '45%', left: '60%' }}>
              <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg animate-pulse">
                <Navigation className="w-6 h-6" />
              </div>
              <div className="bg-white px-2 py-1 rounded text-sm font-medium mt-2 shadow">
                Bus #{bus.routeNumber}
              </div>
            </div>

            {/* Stop Markers */}
            {route.stops.slice(0, 4).map((stop, index) => (
              <div
                key={stop.id}
                className="absolute"
                style={{
                  top: `${20 + index * 20}%`,
                  left: `${20 + index * 15}%`
                }}
              >
                <div className={`p-2 rounded-full shadow-md ${
                  index <= currentStopIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                  {stop.name}
                </div>
              </div>
            ))}

            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">Live GPS Tracking</p>
              <p>Real-time bus location on Route #{bus.routeNumber}</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Route Stops</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {route.stops.map((stop, index) => (
              <div
                key={stop.id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                  index === currentStopIndex
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : index < currentStopIndex
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-gray-50 border-2 border-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === currentStopIndex
                    ? 'bg-blue-500'
                    : index < currentStopIndex
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{stop.name}</div>
                  <div className="text-sm text-gray-600">
                    {index === currentStopIndex && 'Current Stop'}
                    {index === nextStopIndex && `Next Stop - ETA: ${bus.estimatedArrival}`}
                    {index < currentStopIndex && 'Passed'}
                    {index > nextStopIndex && `Stop ${index + 1}`}
                  </div>
                </div>

                {index === currentStopIndex && (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Current
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Planner */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Journey Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-2">Total Route Time</div>
            <div className="text-2xl font-bold text-gray-900">~45 minutes</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-2">Stops Remaining</div>
            <div className="text-2xl font-bold text-gray-900">{route.stops.length - currentStopIndex - 1}</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-2">Bus Capacity</div>
            <div className="text-2xl font-bold text-gray-900">{bus.passengerCount}/{bus.maxCapacity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMapView;