import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Brain,
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  Settings,
  Calculator
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Sidebar() {
  const { darkMode } = useTheme();
  
  return (
    <aside className="w-64 h-screen glass-card border-r border-gray-700/30 fixed">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold text-adaptive">FinanceAI</span>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'bg-accent text-primary' : ''}`
          }>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-adaptive">Dashboard</span>
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'bg-accent text-primary' : ''}`
          }>
            <PieChart className="w-5 h-5" />
            <span className="text-adaptive">Portfolio</span>
          </NavLink>
          <NavLink to="/market" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'bg-accent text-primary' : ''}`
          }>
            <TrendingUp className="w-5 h-5" />
            <span className="text-adaptive">Market Trends</span>
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'bg-accent text-primary' : ''}`
          }>
            <Calculator className="w-5 h-5" />
            <span className="text-adaptive">Calculators</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'bg-accent text-primary' : ''}`
          }>
            <Settings className="w-5 h-5" />
            <span className="text-adaptive">Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}