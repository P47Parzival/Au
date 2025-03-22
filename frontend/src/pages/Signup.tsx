import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Brain } from 'lucide-react';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen bg-primary bg-gradient-radial from-primary-light to-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <Brain className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold">FinanceAI</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" required />
            I agree to the terms & conditions
          </label>

          <button type="submit" className="neon-button w-full">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}