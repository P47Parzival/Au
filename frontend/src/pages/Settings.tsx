import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Moon, Globe, Mail } from 'lucide-react';

export function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
                defaultValue="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Time Zone
              </label>
              <select className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent">
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { icon: Bell, title: 'Push Notifications', description: 'Receive alerts for important updates' },
              { icon: Mail, title: 'Email Notifications', description: 'Get daily summaries and reports' },
              { icon: Globe, title: 'Market Alerts', description: 'Price changes and market updates' },
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
                <div className="flex items-center gap-3">
                  <setting.icon className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">{setting.title}</p>
                    <p className="text-sm text-gray-400">{setting.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-accent text-primary rounded-lg font-medium">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Privacy Mode</p>
                  <p className="text-sm text-gray-400">Hide sensitive information</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-light rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Toggle dark/light theme</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}