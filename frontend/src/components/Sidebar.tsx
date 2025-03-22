import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Brain,
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 h-screen glass-card border-r border-gray-700/30">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold">FinanceAI</span>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" className="sidebar-link">
            <Brain className="w-5 h-5" />
            Home
          </NavLink>
          <NavLink to="/dashboard" className="sidebar-link">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/portfolio" className="sidebar-link">
            <PieChart className="w-5 h-5" />
            Portfolio
          </NavLink>
          <NavLink to="/market" className="sidebar-link">
            <TrendingUp className="w-5 h-5" />
            Market Trends
          </NavLink>
          <NavLink to="/settings" className="sidebar-link">
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}