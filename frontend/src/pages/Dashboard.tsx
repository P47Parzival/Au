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
      className="pb-6 w-[80%] absolute right-6"
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <Doughnut data={assetAllocation} options={doughnutOptions} />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-accent">
                ₹{portfolioData?.total_value.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Today's P&L</p>
              <p className={`text-xl font-semibold ${
                (portfolioData?.metrics.daily_pl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(portfolioData?.metrics.daily_pl || 0) >= 0 ? '+' : ''}
                ₹{Math.abs(portfolioData?.metrics.daily_pl || 0).toLocaleString()}
                <span className="text-sm ml-1">
                  ({(portfolioData?.metrics.daily_change || 0).toFixed(2)}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Investment</p>
              <p className="text-xl font-semibold text-accent">
                ₹{(portfolioData?.metrics.total_investments || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Today's Positions</h2>
          <div className="space-y-3">
            {(portfolioData?.positions || []).map((position, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
                <div>
                  <p className="font-semibold">{position.tradingsymbol}</p>
                  <p className="text-sm text-gray-400">Qty: {position.netQuantity}</p>
                </div>
                <div className="text-right">
                  <p className={position.dayPl >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {position.dayPl >= 0 ? '+' : '-'}₹{Math.abs(position.dayPl).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(!portfolioData?.positions || portfolioData.positions.length === 0) && (
              <div className="text-center text-gray-400 py-4">
                No positions for today
              </div>
            )}
          </div>
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
        color: '#fff',
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
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
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
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
        color: '#fff',
      },
    },
    tooltip: {
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