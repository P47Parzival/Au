import React from 'react';
import { motion } from 'framer-motion';

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          {/* Add portfolio overview content */}
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
          {/* Add market trends content */}
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          {/* Add AI insights content */}
        </div>
      </div>
    </motion.div>
  );
}