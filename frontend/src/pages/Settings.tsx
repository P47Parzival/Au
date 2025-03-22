import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Moon, Globe, Mail, User, Key, Database, Server } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fade-in"
    >
      <h1 className="page-title">Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card">
          <div className="flex items-center mb-6">
            <User className="w-5 h-5 text-accent mr-2" />
            <h2 className="subtitle mb-0">Account Settings</h2>
          </div>
          
          <div className="responsive-grid">
            <div className="stats-card">
              <span className="stats-label">Client ID</span>
              <span className="stats-value text-adaptive">S55255319</span>
            </div>
            
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <span className="stats-label">API Key</span>
                <button className="text-accent hover:text-accent-hover">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <span className="stats-value text-adaptive">••••••••••••</span>
            </div>
            
            <div className="stats-card">
              <span className="stats-label">Email</span>
              <span className="stats-value text-adaptive">user@example.com</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center mb-6">
            <Moon className="w-5 h-5 text-accent mr-2" />
            <h2 className="subtitle mb-0">Preferences</h2>
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
                <p className="text-adaptive-secondary text-sm mt-1">Enable live market data updates</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div>
                <span className="text-adaptive font-medium">Notifications</span>
                <p className="text-adaptive-secondary text-sm mt-1">Receive alerts and important updates</p>
              </div>
              <button className="w-12 h-6 bg-accent rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center mb-6">
            <Database className="w-5 h-5 text-accent mr-2" />
            <h2 className="subtitle mb-0">Trading Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-adaptive font-medium">Default Quantity</span>
                <span className="text-accent">1</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                defaultValue="1"
                className="w-full" 
              />
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <label className="text-adaptive font-medium mb-2 block">Default Exchange</label>
              <select className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent">
                <option>NSE</option>
                <option>BSE</option>
                <option>MCX</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="neon-button w-full">Save Changes</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}