import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [clientId, setClientId] = useState('S55255319'); // Default from AngelLogin.py
  const [pin, setPin] = useState('1234'); // Default from AngelLogin.py
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(clientId, pin, totp);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-primary"
    >
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login with Angel One</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-primary-light p-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Enter your Angel One Client ID"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-primary-light p-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Enter your PIN"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">TOTP</label>
            <input
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              className="w-full bg-primary-light p-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Enter your TOTP"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-accent text-primary font-semibold p-3 rounded-lg hover:bg-accent/90 transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}