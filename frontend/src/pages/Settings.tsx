import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Moon, Globe, Mail } from 'lucide-react';

export function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pb-6 w-[80%] absolute right-6"
    >
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Client ID</p>
              <p className="text-xl">S55255319</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">API Key</p>
              <p className="text-xl">••••••••••••</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <span>Dark Mode</span>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <span>Real-time Updates</span>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}