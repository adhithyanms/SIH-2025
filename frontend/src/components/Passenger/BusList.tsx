// import React from 'react';
// import { Bus } from '../../types/index';
// import { Bus as BusIcon, Clock, Users, MapPin, Navigation } from 'lucide-react';

// interface BusListProps {
//   buses: Bus[];
//   onSelectBus: (busId: string) => void;
// }
// const BusList: React.FC<BusListProps> = ({ buses, onSelectBus }) => {
//   console.log(buses);
//   const getCrowdColor = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'bg-green-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'high': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getCrowdText = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'Low Crowd';
//       case 'medium': return 'Moderate';
//       case 'high': return 'High Crowd';
//       default: return 'Unknown';
//     }
//   };

//   const getCrowdBgColor = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'bg-green-50 border-green-200';
//       case 'medium': return 'bg-yellow-50 border-yellow-200';
//       case 'high': return 'bg-red-50 border-red-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-xl font-semibold text-gray-900">
//           Available Buses ({buses.length})
//         </h3>
//         <div className="flex items-center space-x-4 text-sm text-gray-600">
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//             <span>Low Crowd</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//             <span>Moderate</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//             <span>High Crowd</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4">
//         {buses.map((bus) => (
//           <div
//             key={bus.id}
//             className={`bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${getCrowdBgColor(bus.crowdLevel)}`}
//             onClick={() => onSelectBus(bus._id)}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <BusIcon className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-2xl font-bold text-gray-900">Route #{bus.routeNumber}</h4>
//                   <p className="text-gray-600">Bus ID: {bus.id}</p>
//                 </div>
//               </div>
              
//               <div className="text-right">
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCrowdColor(bus.crowdLevel)}`}>
//                   <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
//                   {getCrowdText(bus.crowdLevel)}
//                 </div>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Current Stop</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">{bus.currentStop}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Navigation className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Next Stop</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">{bus.nextStop}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="w-4 h-4 mr-2" />
//                   <span className="text-sm">ETA</span>
//                 </div>
//                 <div className="font-semibold text-green-600">{bus.estimatedArrival}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Users className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Occupancy</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">
//                   {bus.passengerCount}/{bus.maxCapacity}
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className={`h-2 rounded-full transition-all ${
//                       bus.passengerCount / bus.maxCapacity < 0.5 ? 'bg-green-500' :
//                       bus.passengerCount / bus.maxCapacity < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
//                     }`}
//                     style={{ width: `${(bus.passengerCount / bus.maxCapacity) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-600">
//                 Click to view real-time location and route details
//               </div>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
//                 Track Live
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BusList;





// // import React from 'react';
// // import { Bus } from '../../types/index';
// // import { Bus as BusIcon, Clock, Users, MapPin, Navigation } from 'lucide-react';

// // interface BusListProps {
// //   buses: Bus[];
// //   onSelectBus: (busId: string) => void;
// // }
// // const BusList: React.FC<BusListProps> = ({ buses, onSelectBus }) => {
// //   console.log(buses);
// //   const getCrowdColor = (level: Bus['crowdLevel']) => {
// //     switch (level) {
// //       case 'low': return 'bg-green-500';
// //       case 'medium': return 'bg-yellow-500';
// //       case 'high': return 'bg-red-500';
// //       default: return 'bg-gray-500';
// //     }
// //   };

// //   const getCrowdText = (level: Bus['crowdLevel']) => {
// //     switch (level) {
// //       case 'low': return 'Low Crowd';
// //       case 'medium': return 'Moderate';
// //       case 'high': return 'High Crowd';
// //       default: return 'Unknown';
// //     }
// //   };

// //   const getCrowdBgColor = (level: Bus['crowdLevel']) => {
// //     switch (level) {
// //       case 'low': return 'bg-green-50 border-green-200';
// //       case 'medium': return 'bg-yellow-50 border-yellow-200';
// //       case 'high': return 'bg-red-50 border-red-200';
// //       default: return 'bg-gray-50 border-gray-200';
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h3 className="text-xl font-semibold text-gray-900">
// //           Available Buses ({buses.length})
// //         </h3>
// //         <div className="flex items-center space-x-4 text-sm text-gray-600">
// //           <div className="flex items-center space-x-2">
// //             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
// //             <span>Low Crowd</span>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
// //             <span>Moderate</span>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
// //             <span>High Crowd</span>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid gap-4">
// //         {buses.map((bus) => (
// //           <div
// //             key={bus.id}
// //             className={`bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${getCrowdBgColor(bus.crowdLevel)}`}
// //             onClick={() => onSelectBus(bus._id)}
// //           >
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="flex items-center space-x-4">
// //                 <div className="p-3 bg-blue-100 rounded-full">
// //                   <BusIcon className="w-8 h-8 text-blue-600" />
// //                 </div>
// //                 <div>
// //                   <h4 className="text-2xl font-bold text-gray-900">Route #{bus.routeNumber}</h4>
// //                   <p className="text-gray-600">Bus ID: {bus.id}</p>
// //                 </div>
// //               </div>
              
// //               <div className="text-right">
// //                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCrowdColor(bus.crowdLevel)}`}>
// //                   <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
// //                   {getCrowdText(bus.crowdLevel)}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="grid md:grid-cols-4 gap-6">
// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-600">
// //                   <MapPin className="w-4 h-4 mr-2" />
// //                   <span className="text-sm">Current Stop</span>
// //                 </div>
// //                 <div className="font-semibold text-gray-900">{bus.currentStop}</div>
// //               </div>

// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-600">
// //                   <Navigation className="w-4 h-4 mr-2" />
// //                   <span className="text-sm">Next Stop</span>
// //                 </div>
// //                 <div className="font-semibold text-gray-900">{bus.nextStop}</div>
// //               </div>

// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-600">
// //                   <Clock className="w-4 h-4 mr-2" />
// //                   <span className="text-sm">ETA</span>
// //                 </div>
// //                 <div className="font-semibold text-green-600">{bus.estimatedArrival}</div>
// //               </div>

// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-600">
// //                   <Users className="w-4 h-4 mr-2" />
// //                   <span className="text-sm">Occupancy</span>
// //                 </div>
// //                 <div className="font-semibold text-gray-900">
// //                   {bus.passengerCount}/{bus.maxCapacity}
// //                 </div>
// //                 <div className="w-full bg-gray-200 rounded-full h-2">
// //                   <div
// //                     className={`h-2 rounded-full transition-all ${
// //                       bus.passengerCount / bus.maxCapacity < 0.5 ? 'bg-green-500' :
// //                       bus.passengerCount / bus.maxCapacity < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
// //                     }`}
// //                     style={{ width: `${(bus.passengerCount / bus.maxCapacity) * 100}%` }}
// //                   ></div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
// //               <div className="text-sm text-gray-600">
// //                 Click to view real-time location and route details
// //               </div>
// //               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
// //                 Track Live
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BusList;


// import React from 'react';
// import { Bus } from '../../types/index';
// import { Bus as BusIcon, Clock, Users, MapPin, Navigation } from 'lucide-react';

// interface BusListProps {
//   buses: Bus[];
//   onSelectBus: (busId: string) => void;
// }

// const BusList: React.FC<BusListProps> = ({ buses, onSelectBus }) => {
//   const getCrowdColor = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'bg-green-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'high': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getCrowdText = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'Low Crowd';
//       case 'medium': return 'Moderate';
//       case 'high': return 'High Crowd';
//       default: return 'Unknown';
//     }
//   };

//   const getCrowdBgColor = (level: Bus['crowdLevel']) => {
//     switch (level) {
//       case 'low': return 'bg-green-50 border-green-200';
//       case 'medium': return 'bg-yellow-50 border-yellow-200';
//       case 'high': return 'bg-red-50 border-red-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-xl font-semibold text-gray-900">
//           Available Buses ({buses.length})
//         </h3>
//         <div className="flex items-center space-x-4 text-sm text-gray-600">
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//             <span>Low Crowd</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//             <span>Moderate</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//             <span>High Crowd</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4">
//         {buses.map((bus) => (
//           <div
//             key={bus.id}
//             className={`bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-lg cursor-pointer ${getCrowdBgColor(bus.crowdLevel)}`}
//             onClick={() => onSelectBus(bus._id)} // ✅ This still works for entire card
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <BusIcon className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-2xl font-bold text-gray-900">Route #{bus.routeNumber}</h4>
//                   <p className="text-gray-600">Bus ID: {bus.id}</p>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCrowdColor(bus.crowdLevel)}`}>
//                   <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
//                   {getCrowdText(bus.crowdLevel)}
//                 </div>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Current Stop</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">{bus.currentStop}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Navigation className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Next Stop</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">{bus.nextStop}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="w-4 h-4 mr-2" />
//                   <span className="text-sm">ETA</span>
//                 </div>
//                 <div className="font-semibold text-green-600">{bus.estimatedArrival}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-600">
//                   <Users className="w-4 h-4 mr-2" />
//                   <span className="text-sm">Occupancy</span>
//                 </div>
//                 <div className="font-semibold text-gray-900">
//                   {bus.passengerCount}/{bus.maxCapacity}
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className={`h-2 rounded-full transition-all ${
//                       bus.passengerCount / bus.maxCapacity < 0.5 ? 'bg-green-500' :
//                       bus.passengerCount / bus.maxCapacity < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
//                     }`}
//                     style={{ width: `${(bus.passengerCount / bus.maxCapacity) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-600">
//                 Click to view real-time location and route details
//               </div>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 onClick={(e) => {
//                   e.stopPropagation(); // ✅ prevent parent div click duplication
//                   onSelectBus(bus._id); // ✅ explicitly trigger bus selection
//                 }}
//               >
//                 Track Live
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BusList;


import React from 'react';
import { Bus } from '../../types/index';
import { Bus as BusIcon, Clock, Users, MapPin, Navigation } from 'lucide-react';

interface BusListProps {
  buses: Bus[];
  onSelectBus: (busId: string) => void;
}

const BusList: React.FC<BusListProps> = ({ buses, onSelectBus }) => {
  const getCrowdColor = (level: Bus['crowdLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCrowdText = (level: Bus['crowdLevel']) => {
    switch (level) {
      case 'low': return 'Low Crowd';
      case 'medium': return 'Moderate';
      case 'high': return 'High Crowd';
      default: return 'Unknown';
    }
  };

  const getCrowdBgColor = (level: Bus['crowdLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Available Buses ({buses.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className={`bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-lg cursor-pointer ${getCrowdBgColor(bus.crowdLevel)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BusIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Route #{bus.routeNumber}</h4>
                  <p className="text-gray-600">Bus ID: {bus.id}</p>
                </div>
              </div>

              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCrowdColor(bus.crowdLevel)}`}>
                {getCrowdText(bus.crowdLevel)}
              </div>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <MapPin className="w-4 h-4 mr-2 inline" /> {bus.currentStop}
              </div>
              <div>
                <Navigation className="w-4 h-4 mr-2 inline" /> {bus.nextStop}
              </div>
              <div>
                <Clock className="w-4 h-4 mr-2 inline" /> {bus.estimatedArrival}
              </div>
              <div>
                <Users className="w-4 h-4 mr-2 inline" /> {bus.passengerCount}/{bus.maxCapacity}
              </div>
            </div>

            {/* Track Live Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => onSelectBus(bus.id)} // ✅ Always use bus.id
              >
                Track Live
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusList;