import React from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
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

const portfolioData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [10000, 12000, 11500, 13000, 14500, 15000],
      borderColor: '#00FF94',
      backgroundColor: 'rgba(0, 255, 148, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const assetAllocation = {
  labels: ['Stocks', 'Crypto', 'Bonds', 'Cash'],
  datasets: [
    {
      data: [40, 25, 20, 15],
      backgroundColor: [
        'rgba(0, 255, 148, 0.8)',
        'rgba(123, 63, 228, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderWidth: 0,
    },
  ],
};

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
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
      },
    },
    x: {
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
  },
};

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 w-[80%] absolute right-6"
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <Line data={portfolioData} options={chartOptions} />
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
              <p className="text-2xl font-bold text-accent">$15,000.00</p>
            </div>
            <div>
              <p className="text-gray-400">24h Change</p>
              <p className="text-xl font-semibold text-green-400">+2.5%</p>
            </div>
            <div>
              <p className="text-gray-400">Monthly Return</p>
              <p className="text-xl font-semibold text-accent">+12.3%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-gray-300">Portfolio Diversity</p>
              <p className="mt-1">Your portfolio is tech-heavy. Consider diversifying into energy and healthcare sectors.</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-gray-300">Risk Analysis</p>
              <p className="mt-1">Current risk level: Moderate. Market volatility suggests maintaining cash reserves.</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[
              { type: 'Buy', asset: 'AAPL', amount: '$2,500', date: '2024-03-15' },
              { type: 'Sell', asset: 'BTC', amount: '$1,800', date: '2024-03-14' },
              { type: 'Buy', asset: 'TSLA', amount: '$3,200', date: '2024-03-13' },
            ].map((tx, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
                <div>
                  <p className="font-semibold">{tx.asset}</p>
                  <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={tx.type === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                    {tx.type === 'Buy' ? '+' : '-'}{tx.amount}
                  </p>
                  <p className="text-sm text-gray-400">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}