import React from 'react';
import { useBus } from '../../contexts/BusContext';
import { TrendingUp, Clock, MapPin, Users, AlertCircle, CheckCircle } from 'lucide-react';

const SystemOverview: React.FC = () => {
  const { buses, routes } = useBus();

  const systemStatus = {
    operational: buses.filter(bus => bus.isActive).length,
    maintenance: buses.length - buses.filter(bus => bus.isActive).length,
    onTime: Math.floor(buses.length * 0.8),
    delayed: Math.ceil(buses.length * 0.2)
  };

  return (
    <div className="space-y-8">
      {/* System Health */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Operational Buses</span>
              <span className="font-bold text-green-600">{systemStatus.operational}/{buses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">On-Time Performance</span>
              <span className="font-bold text-green-600">{Math.round((systemStatus.onTime / buses.length) * 100)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(systemStatus.operational / buses.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Status</h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{buses.reduce((sum, bus) => sum + bus.passengerCount, 0)}</div>
              <div className="text-sm text-gray-600">Active Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{routes.length}</div>
              <div className="text-sm text-gray-600">Active Routes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent System Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 mins ago', event: 'Bus #101 reached City Center', type: 'info' },
            { time: '5 mins ago', event: 'High crowd alert on Route #102', type: 'warning' },
            { time: '8 mins ago', event: 'New conductor logged in (ID: C123)', type: 'success' },
            { time: '12 mins ago', event: 'Route #103 completed journey', type: 'info' },
            { time: '15 mins ago', event: 'Emergency alert resolved on Bus #102', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'warning' ? 'bg-yellow-500' :
                activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.event}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Performance */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Routes</h3>
          <div className="space-y-4">
            {routes.slice(0, 3).map((route, index) => {
              const routeBuses = buses.filter(bus => bus.routeNumber === route.routeNumber);
              const avgPassengers = routeBuses.reduce((sum, bus) => sum + bus.passengerCount, 0) / routeBuses.length || 0;
              
              return (
                <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Route #{route.routeNumber}</div>
                    <div className="text-sm text-gray-600">{route.routeName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{Math.round(avgPassengers)}</div>
                    <div className="text-xs text-gray-600">avg passengers</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crowd Levels Distribution</h3>
          <div className="space-y-4">
            {['low', 'medium', 'high'].map((level) => {
              const count = buses.filter(bus => bus.crowdLevel === level).length;
              const percentage = buses.length > 0 ? (count / buses.length) * 100 : 0;
              
              return (
                <div key={level}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{level} Crowd</span>
                    <span className="text-sm text-gray-600">{count} buses ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        level === 'low' ? 'bg-green-500' :
                        level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;