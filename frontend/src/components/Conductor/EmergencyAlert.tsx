import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle } from 'lucide-react';

interface EmergencyAlertProps {
  busId: string;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ busId }) => {
  const [alertType, setAlertType] = useState<'emergency' | 'breakdown' | 'delay' | 'info'>('emergency');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const alertTypes = [
    { value: 'emergency', label: 'Emergency', color: 'red', description: 'Medical or safety emergency' },
    { value: 'breakdown', label: 'Breakdown', color: 'orange', description: 'Vehicle mechanical issues' },
    { value: 'delay', label: 'Delay', color: 'yellow', description: 'Route delays or traffic' },
    { value: 'info', label: 'Information', color: 'blue', description: 'General passenger info' }
  ];

  const predefinedMessages = {
    emergency: [
      'Medical emergency - Need immediate assistance',
      'Safety concern - Requesting security support',
      'Accident on route - Emergency services needed'
    ],
    breakdown: [
      'Bus breakdown - Passengers need alternative transport',
      'Engine trouble - Unable to continue route',
      'Flat tire - Delayed by 30 minutes'
    ],
    delay: [
      'Heavy traffic - 15 minutes delayed',
      'Road construction - Taking alternate route',
      'Weather conditions causing delays'
    ],
    info: [
      'Route change due to road closure',
      'Next bus arriving in 10 minutes',
      'Service temporarily suspended'
    ]
  };

  const handleSendAlert = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Simulate sending alert
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAlertSent(true);
    setIsLoading(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setAlertSent(false);
      setMessage('');
    }, 3000);
  };

  if (alertSent) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Alert Sent Successfully</h3>
          <p className="text-gray-600 mb-4">
            Your {alertType} alert has been sent to passengers and the control center.
          </p>
          <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
            <div className="text-sm text-gray-600 mb-1">Alert Message:</div>
            <div className="font-medium text-gray-900">"{message}"</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert System</h3>
        <p className="text-gray-600">Send alerts to passengers and depot control center</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Alert Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {alertTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setAlertType(type.value as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  alertType === type.value
                    ? `border-${type.color}-500 bg-${type.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`font-semibold ${
                  alertType === type.value ? `text-${type.color}-700` : 'text-gray-700'
                }`}>
                  {type.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Messages</label>
          <div className="grid gap-2">
            {predefinedMessages[alertType].map((msg, index) => (
              <button
                key={index}
                onClick={() => setMessage(msg)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your alert message..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleSendAlert}
        disabled={!message.trim() || isLoading}
        className="w-full py-4 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center space-x-2"
      >
        <Send className="w-6 h-6" />
        <span>{isLoading ? 'Sending Alert...' : `Send ${alertTypes.find(t => t.value === alertType)?.label} Alert`}</span>
      </button>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
        <p className="text-yellow-700 text-sm">
          Emergency alerts are sent immediately to all passengers on this route and the depot control center. 
          Use responsibly and only when necessary.
        </p>
      </div>
    </div>
  );
};

export default EmergencyAlert;