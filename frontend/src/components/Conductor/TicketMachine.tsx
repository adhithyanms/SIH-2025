import React, { useState } from 'react';
import { useBus } from '../../contexts/BusContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { MapPin, DollarSign, QrCode, Printer, Plus, Minus } from 'lucide-react';

interface TicketMachineProps {
  routeNumber: string;
}

const TicketMachine: React.FC<TicketMachineProps> = ({ routeNumber }) => {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [farePerPassenger, setFarePerPassenger] = useState(10);
  const [passengerCount, setPassengerCount] = useState(1);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Access global routes and addTicket from BusContext
  const { routes, addTicket } = useBus();
  const { user } = useAuth();

  const currentRoute = routes.find(route => route.routeNumber === routeNumber);
  const stops = currentRoute?.stops || [];

  const calculateFare = (from: string, to: string) => {
    const fromIndex = stops.findIndex(stop => stop.name === from);
    const toIndex = stops.findIndex(stop => stop.name === to);
    const distance = Math.abs(toIndex - fromIndex);
    return Math.max(10, distance * 5); // base fare per passenger
  };

  const handleStopChange = (from: string, to: string) => {
    setFromStop(from);
    setToStop(to);
    if (from && to) {
      setFarePerPassenger(calculateFare(from, to));
    }
  };

  const incrementCount = () => setPassengerCount(c => c + 1);
  const decrementCount = () => setPassengerCount(c => (c > 1 ? c - 1 : 1));

  const generateTicket = async () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiService.generateTicket({
        routeNumber,
        fromStop,
        toStop,
        passengerCount,
        conductorId: user.id
      });

      const ticket = {
        id: response.ticket.id,
        routeNumber: response.ticket.routeNumber,
        fromStop: response.ticket.fromStop,
        toStop: response.ticket.toStop,
        passengerCount: response.ticket.passengerCount,
        fare: response.ticket.fare,
        timestamp: new Date(response.ticket.timestamp).toLocaleString(),
        qrCode: response.ticket.qrCode
      };

      setGeneratedTicket(ticket);

      // ✅ Update global ticket count and per-stop tally
      addTicket(toStop, passengerCount);
    } catch (error: any) {
      alert(error.message || 'Failed to generate ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFromStop('');
    setToStop('');
    setFarePerPassenger(10);
    setPassengerCount(1);
    setGeneratedTicket(null);
  };

  if (generatedTicket) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ticket Generated</h3>
            <p className="text-gray-600">Show this ticket to the passenger</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm max-w-sm mx-auto">
            <div className="text-center border-b pb-4 mb-4">
              <h4 className="font-bold text-lg">BusTrack Pro</h4>
              <p className="text-gray-600 text-sm">Route #{generatedTicket.routeNumber}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{generatedTicket.fromStop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{generatedTicket.toStop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{generatedTicket.passengerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fare:</span>
                <span className="font-bold text-green-600">₹{generatedTicket.fare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="text-sm">{generatedTicket.timestamp}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-mono text-sm mb-2">{generatedTicket.qrCode}</div>
              <div className="w-24 h-24 bg-black mx-auto rounded"></div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              Ticket ID: {generatedTicket.id}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={resetForm}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Printer className="w-5 h-5" />
            <span>Generate New Ticket</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Digital Ticket Machine</h3>
        <p className="text-gray-600">Generate tickets for passengers on Route #{routeNumber}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* From Stop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              From Stop
            </label>
            <select
              value={fromStop}
              onChange={(e) => handleStopChange(e.target.value, toStop)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select boarding stop</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.name}>{stop.name}</option>
              ))}
            </select>
          </div>

          {/* To Stop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              To Stop
            </label>
            <select
              value={toStop}
              onChange={(e) => handleStopChange(fromStop, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={!fromStop}
            >
              <option value="">Select destination stop</option>
              {stops
                .filter(stop => stop.name !== fromStop)
                .map((stop) => (
                  <option key={stop.id} value={stop.name}>{stop.name}</option>
                ))
              }
            </select>
          </div>

          {/* Passenger Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementCount}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold">{passengerCount}</span>
              <button
                onClick={incrementCount}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fare Calculation */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Fare Calculation
          </h4>
          
          {fromStop && toStop ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{fromStop}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{toStop}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{passengerCount}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Fare:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{farePerPassenger * passengerCount}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Select both stops to calculate fare
            </p>
          )}
        </div>
      </div>

      <button
        onClick={generateTicket}
        disabled={!fromStop || !toStop || isGenerating}
        className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center space-x-2"
      >
        <QrCode className="w-6 h-6" />
        <span>{isGenerating ? 'Generating...' : 'Generate Digital Ticket'}</span>
      </button>
    </div>
  );
};

export default TicketMachine;
