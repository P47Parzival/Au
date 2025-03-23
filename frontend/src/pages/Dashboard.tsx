import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { stocksApi } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PortfolioData {
  total_value: number;
  holdings: Array<{
    tradingsymbol: string;
    quantity: number;
    ltp: number;
    averageprice: number;
    profitandloss: number;
    pnlpercentage: number;
  }>;
  positions: Array<{
    tradingsymbol: string;
    netQuantity: number;
    dayPl: number;
  }>;
  historical_data: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  metrics: {
    daily_change: number;
    total_investments: number;
    daily_pl: number;
  };
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    fetchPortfolioData();
    const interval = setInterval(fetchPortfolioData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await stocksApi.getPortfolio();
      if (response.data) {
        setPortfolioData(response.data);
        setError(null);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Portfolio error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data from historical data
  const chartData = {
    labels: portfolioData?.historical_data?.map(d => new Date(d.timestamp).toLocaleDateString()) || [],
    datasets: [{
      label: 'Portfolio Value',
      data: portfolioData?.historical_data?.map(d => d.close) || [],
      borderColor: '#00FF94',
      backgroundColor: 'rgba(0, 255, 148, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  // Prepare asset allocation data
  const assetAllocation = {
    labels: portfolioData?.holdings?.map(h => h.tradingsymbol) || [],
    datasets: [{
      data: portfolioData?.holdings?.map(h => (h.ltp * h.quantity)) || [],
      backgroundColor: [
        'rgba(0, 255, 148, 0.8)',
        'rgba(123, 63, 228, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderWidth: 0,
    }],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fade-in"
    >
      <h1 className="page-title">Dashboard</h1>
      
      <div className="responsive-grid mb-6">
        <div className="glass-card">
          <h2 className="text-adaptive">Total Portfolio Value</h2>
          <div className="stats-card">
            <span className="stats-label">Current Value</span>
            <span className="stats-value">₹{portfolioData?.total_value.toLocaleString() || 0}</span>
          </div>
        </div>
        
        <div className="glass-card">
          <h2 className="text-adaptive">Today's P&L</h2>
          <div className="stats-card">
            <span className="stats-label">Profit/Loss</span>
            <div className="flex items-center">
              <span className={`stats-value ${(portfolioData?.metrics.daily_pl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(portfolioData?.metrics.daily_pl || 0) >= 0 ? '+' : ''}
                ₹{Math.abs(portfolioData?.metrics.daily_pl || 0).toLocaleString()}
              </span>
              {(portfolioData?.metrics.daily_change || 0) >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-400 ml-2" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-400 ml-2" />
              )}
            </div>
            <span className="text-adaptive-secondary text-sm">
              ({(portfolioData?.metrics.daily_change || 0).toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="glass-card">
          <h2 className="text-adaptive">Total Investment</h2>
          <div className="stats-card">
            <span className="stats-label">Invested Amount</span>
            <span className="stats-value">₹{(portfolioData?.metrics.total_investments || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-card lg:col-span-2 portfolio-overview">
          <h2 className="chart-title">Portfolio Overview</h2>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="glass-card asset-allocation">
          <h2 className="chart-title">Asset Allocation</h2>
          <div className="chart-container">
            <Doughnut data={assetAllocation} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center mb-4">
          <Briefcase className="w-6 h-6 text-accent mr-2" />
          <h2 className="subtitle mb-0">Today's Positions</h2>
        </div>
        
        <div className="responsive-grid">
          {(portfolioData?.positions || []).map((position, i) => (
            <div key={i} className="stats-card">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-adaptive">{position.tradingsymbol}</span>
                <span className={`px-2 py-1 rounded text-sm ${position.dayPl >= 0 ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                  {position.dayPl >= 0 ? '+' : '-'}₹{Math.abs(position.dayPl).toLocaleString()}
                </span>
              </div>
              <span className="text-adaptive-secondary">Qty: {position.netQuantity}</span>
            </div>
          ))}
          
          {(!portfolioData?.positions || portfolioData.positions.length === 0) && (
            <div className="text-center p-10 text-adaptive-secondary">
              No positions for today
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'var(--chart-text)', // Changed to chart-text to match theme
        font: {
          weight: 500
        }
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      grid: {
        color: 'var(--chart-grid)', // Use chart grid color variable
      },
      ticks: {
        color: 'var(--chart-text)', // Use chart text color variable
        callback: function(value: number | string) {
          if (typeof value === 'number') {
            return '₹' + value.toLocaleString();
          }
          return value;
        }
      },
    },
    x: {
      type: 'category' as const,
      grid: {
        color: 'var(--chart-grid)', // Use chart grid color variable
      },
      ticks: {
        color: 'var(--chart-text)', // Use chart text color variable
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'var(--chart-text)', // Changed to chart-text to match theme
        font: {
          weight: 500
        }
      },
    },
    tooltip: {
      backgroundColor: 'var(--color-primary-light)',
      titleColor: 'var(--chart-text)', // Changed to chart-text to match theme
      bodyColor: 'var(--chart-text)', // Changed to chart-text to match theme
      borderColor: 'var(--border-color)',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const value = context.raw;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `₹${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};
