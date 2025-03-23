import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [clientId, setClientId] = useState('');
  const [pin, setPin] = useState('');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestBody = {
        client_id: clientId,
        password: pin.toString(),
        totp: totp.toString(),
      };
      
      console.log('Sending login request with:', requestBody);

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
        console.log('Received response:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No authentication token received');
      }

      if (typeof data.token !== 'string') {
        console.error('Token is not a string:', data.token);
        throw new Error('Invalid token received from server');
      }

      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-primary-light rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-center text-accent mb-2">TradeWise</h1>
          <h2 className="text-xl text-center text-gray-400">Login to your account</h2>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-400">
              Client ID
            </label>
            <input
              id="clientId"
              type="text"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-400">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="totp" className="block text-sm font-medium text-gray-400">
              TOTP
            </label>
            <input
              id="totp"
              type="text"
              required
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-accent text-primary rounded-lg font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <a 
              href="https://smartapi.angelbroking.com/enable-totp" // Replace with your actual TOTP link
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors text-sm flex items-center justify-center gap-2"
            >
              Don't have TOTP? Click here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}