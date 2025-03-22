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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          password: pin,
          totp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/90'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}