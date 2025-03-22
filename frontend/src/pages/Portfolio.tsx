import React from 'react';
import { motion } from 'framer-motion';

export function Portfolio() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        {/* Add portfolio content */}
      </div>
    </motion.div>
  );
}