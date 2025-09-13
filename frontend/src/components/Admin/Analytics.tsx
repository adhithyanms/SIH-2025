import React from 'react';
import { useBus } from '../../contexts/BusContext';
import { BarChart3, TrendingUp, Users, Clock, MapPin, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  const { buses, routes } = useBus();

  // Mock analytics data
  const analyticsData = {
    dailyRidership: [
      { day: 'Mon', passengers: 1250 },
      { day: 'Tue', passengers: 1380 },
      { day: 'Wed', passengers: 1420 },
      { day: 'Thu', passengers: 1310 },
      { day: 'Fri', passengers: 1680 },
      { day: 'Sat', passengers: 950 },
      { day: 'Sun', passengers: 850 }
    ],
    routeEfficiency: routes.map(route => ({
      route: route.routeNumber,
      name: route.routeName,
      avgPassengers: Math.floor(Math.random() * 40) + 10,
      onTimePercentage: Math.floor(Math.random() * 20) + 75,
      revenue: Math.floor(Math.random() * 5000) + 3000
    })),
    peakHours: [
      { hour: '6 AM', load: 45 },
      { hour: '7 AM', load: 85 },
      { hour: '8 AM', load: 95 },
      { hour: '9 AM', load: 75 },
      { hour: '10 AM', load: 40 },
      { hour: '5 PM', load: 80 },
      { hour: '6 PM', load: 90 },
      { hour: '7 PM', load: 70 }
    ]
  };

  const totalRevenue = analyticsData.routeEfficiency.reduce((sum, route) => sum + route.revenue, 0);
  const avgOnTime = analyticsData.routeEfficiency.reduce((sum, route) => sum + route.onTimePercentage, 0) / analyticsData.routeEfficiency.length;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">8,840</div>
          <div className="text-sm text-gray-600">Weekly Ridership</div>
          <div className="text-xs text-green-600 mt-2">+12% from last week</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Weekly Revenue</div>
          <div className="text-xs text-green-600 mt-2">+8% from last week</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="text-xs text-green-600">Good</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(avgOnTime)}%</div>
          <div className="text-sm text-gray-600">On-Time Performance</div>
          <div className="text-xs text-green-600 mt-2">+3% from last week</div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 text-orange-600" />
            <div className="text-xs text-blue-600">{routes.length} active</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
          <div className="text-sm text-gray-600">Route Efficiency</div>
          <div className="text-xs text-green-600 mt-2">+1% from last week</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Daily Ridership Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Daily Ridership Trend
          </h3>
          <div className="space-y-4">
            {analyticsData.dailyRidership.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(day.passengers / 1700) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-semibold text-gray-900">
                  {day.passengers.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Peak Hours Analysis
          </h3>
          <div className="space-y-4">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={hour.hour} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{hour.hour}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                      hour.load > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      hour.load > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${hour.load}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-900">
                  {hour.load}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Performance Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Route Performance Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Route</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Avg Passengers</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">On-Time %</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Weekly Revenue</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.routeEfficiency.map((route) => (
                <tr key={route.route} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">Route #{route.route}</div>
                      <div className="text-sm text-gray-600">{route.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{route.avgPassengers}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      route.onTimePercentage >= 90 ? 'text-green-600' :
                      route.onTimePercentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {route.onTimePercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{route.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            route.onTimePercentage >= 90 ? 'bg-green-500' :
                            route.onTimePercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${route.onTimePercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        route.onTimePercentage >= 90 ? 'text-green-600' :
                        route.onTimePercentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {route.onTimePercentage >= 90 ? 'Excellent' :
                         route.onTimePercentage >= 80 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Key Insights & Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Performance Highlights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Friday shows highest ridership with 1,680 passengers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Morning rush (7-9 AM) accounts for 30% of daily passengers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Route #101 shows excellent performance with 94% on-time</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Optimization Opportunities</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Consider additional buses during Friday peak hours</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Route #102 needs attention for on-time performance</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Weekend services could be optimized for better efficiency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;