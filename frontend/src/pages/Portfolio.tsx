import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { stocksApi } from '../services/api';
import { TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, RefreshCw } from 'lucide-react';

interface PortfolioData {
  total_value: number;
  holdings: Array<{
    tradingsymbol: string;
    exchange: string;
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
  metrics: {
    daily_change: number;
    total_investments: number;
    daily_pl: number;
  };
}

export function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.error('Portfolio data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const pieData = {
    labels: portfolioData?.holdings?.map(holding => holding.tradingsymbol) || [],
    datasets: [
      {
        data: portfolioData?.holdings?.map(holding => holding.ltp * holding.quantity) || [],
        backgroundColor: [
          'rgba(0, 255, 148, 0.8)',
          'rgba(123, 63, 228, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'var(--text-primary)',
          font: {
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'var(--color-primary-light)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-primary)',
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Portfolio</h1>
        <div className="glass-card p-3 flex items-center">
          <span className="text-adaptive-secondary mr-2">Total Value:</span>
          <span className="text-xl font-bold text-accent">₹{portfolioData?.total_value.toLocaleString() || '0'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="subtitle mb-0">Holdings</h2>
            <button className="flex items-center text-adaptive-secondary hover:text-accent transition-colors" onClick={fetchPortfolioData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="custom-table w-full">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-adaptive-secondary font-medium px-4 py-3">Symbol</th>
                  <th className="text-adaptive-secondary font-medium px-4 py-3">Exchange</th>
                  <th className="text-right text-adaptive-secondary font-medium px-4 py-3">Qty</th>
                  <th className="text-right text-adaptive-secondary font-medium px-4 py-3">Avg. Price</th>
                  <th className="text-right text-adaptive-secondary font-medium px-4 py-3">LTP</th>
                  <th className="text-right text-adaptive-secondary font-medium px-4 py-3">Current Value</th>
                  <th className="text-right text-adaptive-secondary font-medium px-4 py-3">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData?.holdings?.map((holding) => (
                  <tr key={holding.tradingsymbol} 
                      className="border-b border-border-color hover:bg-primary-light/50 transition-colors">
                    <td className="px-4 py-3 text-adaptive font-medium">{holding.tradingsymbol}</td>
                    <td className="px-4 py-3 text-adaptive-secondary">{holding.exchange}</td>
                    <td className="px-4 py-3 text-right">{holding.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{holding.averageprice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">₹{holding.ltp.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right ${
                      holding.profitandloss >= 0 ? 'value-positive' : 'value-negative'
                    }`}>
                      {holding.profitandloss >= 0 ? '+' : ''}₹{holding.profitandloss.toLocaleString()}
                      <span className="text-sm ml-1">
                        ({holding.pnlpercentage >= 0 ? '+' : ''}{holding.pnlpercentage.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card distribution">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-accent mr-2" />
            <h2 className="chart-title">Distribution</h2>
          </div>
          <div className="chart-container">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="glass-card lg:col-span-3">
          <h2 className="subtitle text-adaptive">Performance Metrics</h2>
          <div className="responsive-grid">
            <div className="stats-card">
              <span className="stats-label">Today's P&L</span>
              <div className="flex items-center">
                <span className={`stats-value ${(portfolioData?.metrics.daily_pl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(portfolioData?.metrics.daily_pl || 0) >= 0 ? '+' : ''}₹{Math.abs(portfolioData?.metrics.daily_pl || 0).toLocaleString()}
                </span>
                {(portfolioData?.metrics.daily_change || 0) >= 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-400 ml-2" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-400 ml-2" />
                )}
              </div>
              <span className="text-adaptive-secondary">
                Daily change: {(portfolioData?.metrics.daily_change || 0).toFixed(2)}%
              </span>
            </div>
            
            <div className="stats-card">
              <span className="stats-label">Total Investment</span>
              <span className="stats-value text-accent">
                ₹{(portfolioData?.metrics.total_investments || 0).toLocaleString()}
              </span>
              <span className="text-adaptive-secondary">
                Initial capital
              </span>
            </div>
            
            <div className="stats-card">
              <span className="stats-label">Total Value</span>
              <span className="stats-value text-accent">
                ₹{(portfolioData?.total_value || 0).toLocaleString()}
              </span>
              <span className="text-adaptive-secondary">
                Current portfolio value
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}