import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, ChevronRight, BarChart2, Shield, LineChart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Home() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-b from-primary to-primary-dark overflow-hidden relative"
    >
      {/* Enhanced abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-accent blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-purple-500 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 h-full flex flex-col items-center justify-center">
        {/* Logo and brand */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent opacity-20 blur-lg rounded-full"></div>
            <div className="flex items-center justify-center p-4 bg-primary-light border border-accent rounded-full relative z-10">
              <TrendingUp className="text-accent mr-2 h-10 w-10" />
              <Brain className="text-accent h-10 w-10" />
            </div>
          </div>
        </motion.div>

        {/* Main content - centered */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center max-w-4xl mx-auto z-10 mb-16"
        >
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 tracking-tight">
            <span className="text-adaptive">Trade</span>
            <span className="text-accent">Wise</span>
          </h1>
          <p className="text-xl lg:text-2xl text-adaptive-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
            Your intelligent trading companion powered by AI. Make smarter investment decisions with real-time data analysis and personalized recommendations.
          </p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${darkMode ? 'rgba(52, 211, 153, 0.5)' : 'rgba(2, 132, 199, 0.5)'}` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-12 py-6 bg-accent text-primary rounded-xl font-medium hover:bg-accent-hover transition-all flex items-center justify-center text-lg shadow-lg"
            >
              Get Started <ChevronRight className="ml-2 h-6 w-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Features section */}
      <div className="absolute bottom-0 left-0 w-full bg-primary-light bg-opacity-80 backdrop-blur-md py-12 border-t border-opacity-20 border-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mb-4">
                <Brain className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-adaptive font-medium mb-2 text-xl">AI-Powered Analysis</h3>
              <p className="text-adaptive-secondary text-base">Advanced algorithms that learn from market patterns</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mb-4">
                <LineChart className="text-green-500 h-8 w-8" />
              </div>
              <h3 className="text-adaptive font-medium mb-2 text-xl">Real-Time Market Data</h3>
              <p className="text-adaptive-secondary text-base">Up-to-the-second information for timely decisions</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-4">
                <BarChart2 className="text-blue-500 h-8 w-8" />
              </div>
              <h3 className="text-adaptive font-medium mb-2 text-xl">Portfolio Optimization</h3>
              <p className="text-adaptive-secondary text-base">Balanced strategies to maximize your returns</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mb-4">
                <Shield className="text-purple-500 h-8 w-8" />
              </div>
              <h3 className="text-adaptive font-medium mb-2 text-xl">Risk Management Tools</h3>
              <p className="text-adaptive-secondary text-base">Protect your investments with smart safeguards</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}