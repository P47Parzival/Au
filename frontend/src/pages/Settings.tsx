import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Shield, Eye, Moon, Globe, Mail, User, Key, 
  Wallet, LineChart, AlertTriangle, Clock 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fade-in"
    >
      <h1 className="page-title text-adaptive">Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Account Settings */}
        <div className="glass-card">
          <div className="flex items-center mb-6">
            <User className="w-5 h-5 text-accent mr-2" />
            <h2 className="subtitle mb-0 text-adaptive">Account Settings</h2>
          </div>
          
          <div className="responsive-grid gap-4">
            <div className="stats-card">
              <span className="stats-label">Client ID</span>
              <span className="stats-value text-adaptive">S55255319</span>
              <span className="text-xs text-adaptive-secondary mt-1">Trading Account</span>
            </div>
            
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <span className="stats-label">API Key</span>
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <span className="stats-value text-adaptive">
                {showApiKey ? 'API_KEY_12345' : '••••••••••••'}
              </span>
              <span className="text-xs text-adaptive-secondary mt-1">Last Generated: 22 Mar 2024</span>
            </div>
            
            <div className="stats-card">
              <span className="stats-label">Email</span>
              <span className="stats-value text-adaptive">user@example.com</span>
              <span className="text-xs text-adaptive-secondary mt-1">Verified</span>
            </div>
          </div>
        </div>

       

        {/* Display Settings */}
        <div className="glass-card">
          <div className="flex items-center mb-6">
            <Moon className="w-5 h-5 text-accent mr-2" />
            <h2 className="subtitle mb-0 text-adaptive">Display Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div>
                <span className="text-adaptive font-medium">Dark Mode</span>
                <p className="text-adaptive-secondary text-sm mt-1">Switch between dark and light mode</p>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                  darkMode 
                    ? 'bg-accent shadow-[0_0_10px_rgba(52,235,186,0.5)]' 
                    : 'bg-gray-400'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  darkMode ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div>
                <span className="text-adaptive font-medium">Real-time Updates</span>
                <p className="text-adaptive-secondary text-sm mt-1">Auto-refresh market data</p>
              </div>
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