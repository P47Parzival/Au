import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Brain,
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  Settings,
  Calculator,
  BookOpen
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Sidebar() {
  const { darkMode } = useTheme();
  
  return (
    <aside className="w-64 h-screen glass-card border-r border-gray-700/30 fixed">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold text-adaptive">TradeWise</span>
        </div>

        <nav className="space-y-2">
          {[
            { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
            { to: "/portfolio", icon: <PieChart className="w-5 h-5" />, label: "Portfolio" },
            { to: "/market", icon: <TrendingUp className="w-5 h-5" />, label: "Market Trends" },
            { to: "/calculator", icon: <Calculator className="w-5 h-5" />, label: "Calculators" },
            { to: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {icon}
              <span className="text-adaptive">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}