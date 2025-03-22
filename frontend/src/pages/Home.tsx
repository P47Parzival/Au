import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, ChevronRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-primary p-4"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-accent">TradeWise</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your intelligent trading companion powered by AI
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-accent text-primary rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
}