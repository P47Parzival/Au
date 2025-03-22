import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { stocksApi } from '../services/api';

interface Holding {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  ltp: number;
  pnl: number;
  averageprice: number;
  close: number;
}

interface Position {
  tradingsymbol: string;
  netQuantity: number;
  buyQuantity: number;
  sellQuantity: number;
  buyAmount: number;
  sellAmount: number;
  dayPl: number;
  ltp: number;
}

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState({
    holdings: true,
    positions: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioData();
    const interval = setInterval(fetchPortfolioData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [holdingsData, positionsData] = await Promise.all([
        stocksApi.getHoldings(),
        stocksApi.getPositions()
      ]);

      setHoldings(holdingsData.data || []);
      setPositions(positionsData.data || []);
      setError(null);
    } catch (err) {
      console.error('Portfolio data fetch error:', err);
      setError('Failed to load portfolio data');
      // Don't update state if there's an error to preserve last known good state
    } finally {
      setLoading({
        holdings: false,
        positions: false
      });
    }
  };

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.ltp * holding.quantity), 0);
  const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0);
  const dayPnL = positions.reduce((sum, position) => sum + position.dayPl, 0);

  const pieData = {
    labels: holdings.map(holding => holding.tradingsymbol),
    datasets: [
      {
        data: holdings.map(holding => holding.ltp * holding.quantity),
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

  if (loading.holdings || loading.positions) {
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
      className="flex-1 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <div className="text-right">
          <p className="text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-accent">₹{totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4">Symbol</th>
                  <th className="pb-4">Exchange</th>
                  <th className="pb-4 text-right">Qty</th>
                  <th className="pb-4 text-right">Avg. Price</th>
                  <th className="pb-4 text-right">LTP</th>
                  <th className="pb-4 text-right">Current Value</th>
                  <th className="pb-4 text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.tradingsymbol} className="border-b border-gray-700/50">
                    <td className="py-4 font-semibold">{holding.tradingsymbol}</td>
                    <td className="py-4 text-gray-300">{holding.exchange}</td>
                    <td className="py-4 text-right">{holding.quantity}</td>
                    <td className="py-4 text-right">₹{holding.averageprice.toLocaleString()}</td>
                    <td className="py-4 text-right">₹{holding.ltp.toLocaleString()}</td>
                    <td className="py-4 text-right">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
                    <td className={`py-4 text-right ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.pnl >= 0 ? '+' : ''}₹{holding.pnl.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Distribution</h2>
          <Pie data={pieData} options={pieOptions} />
        </div>

        <div className="glass-card p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Today's P&L</p>
              <p className={`text-2xl font-bold ${dayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {dayPnL >= 0 ? '+' : ''}₹{dayPnL.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Overall P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Total Investment</p>
              <p className="text-2xl font-bold text-accent">
                ₹{holdings.reduce((sum, h) => sum + (h.averageprice * h.quantity), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}