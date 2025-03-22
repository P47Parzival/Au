import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, ChevronRight } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-primary bg-gradient-radial from-primary-light to-primary">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold">FinanceAI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-accent">Login</Link>
          <Link to="/signup" className="neon-button">Sign Up</Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Your AI-Powered
              <span className="text-accent block mt-2">Investment Partner</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Harness the power of artificial intelligence to make smarter investment decisions.
              Get personalized insights, real-time analysis, and predictive market trends.
            </p>
            <Link 
              to="/signup" 
              className="neon-button inline-flex items-center gap-2"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-xl font-semibold">Market Analysis</h3>
                  <p className="text-gray-400">Real-time insights</p>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800"
                alt="AI Analytics"
                className="rounded-lg w-full"
              />
            </div>
            <div className="absolute inset-0 bg-accent/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}