import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, KeyRound, LogIn } from 'lucide-react';

interface LoginProps { onBack?: () => void }

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  
  const { login, sendOTP, isLoading } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      await sendOTP(phoneNumber);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(phoneNumber, otp);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-600">
            {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={10}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <KeyRound className="w-4 h-4 inline mr-2" />
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono"
                maxLength={4}
                required
              />
              <p className="text-sm text-gray-500 mt-2">Check console for OTP in development mode</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button type="button" onClick={() => setStep('phone')} className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors">Change Phone Number</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;