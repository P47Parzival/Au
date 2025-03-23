import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, Moon, Sun, ClipboardList ,LayoutDashboard, PieChart, TrendingUp, Calculator, Settings, MessageCircle, CreditCard } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/portfolio', label: 'Portfolio', Icon: PieChart },
  { path: '/market', label: 'Market', Icon: TrendingUp },
  { path: '/calculator', label: 'Calculator', Icon: Calculator },
  { path: '/sebi-rules', label: 'SEBI Rules', Icon: ClipboardList },
  { path: '/graph', label: 'Graph', Icon: TrendingUp },
  { path: '/settings', label: 'Settings', Icon: Settings },
  { path: '/chat', label: 'AI Advisor', Icon: MessageCircle },
  { path: '/payment', label: 'Payment', Icon: CreditCard },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex min-h-screen bg-primary transition-all duration-300">
      {/* Sidebar */}
      <div className="w-64 fixed h-full glass-card border-r border-border-color transition-all duration-300">
        <div className="flex flex-col h-full p-6">
          <h1 className="text-2xl font-bold text-accent mb-10">TradeWise</h1>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.Icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme and Logout Section */}
          <div className="mt-auto space-y-3">
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-adaptive hover:bg-primary-light-hover transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}