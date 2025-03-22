import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';

const portfolioHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 175.12, value: 8756.00, change: 2.5 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 30, price: 202.45, value: 6073.50, change: -1.2 },
  { symbol: 'MSFT', name: 'Microsoft', shares: 25, price: 415.50, value: 10387.50, change: 1.8 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, price: 147.60, value: 2214.00, change: 0.5 },
  { symbol: 'AMZN', name: 'Amazon.com', shares: 20, price: 175.35, value: 3507.00, change: -0.8 },
];

const pieData = {
  labels: portfolioHoldings.map(stock => stock.symbol),
  datasets: [
    {
      data: portfolioHoldings.map(stock => stock.value),
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
  },
};

export function Portfolio() {
  const totalValue = portfolioHoldings.reduce((sum, stock) => sum + stock.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <div className="text-right">
          <p className="text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-accent">${totalValue.toLocaleString()}</p>
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
                  <th className="pb-4">Name</th>
                  <th className="pb-4 text-right">Shares</th>
                  <th className="pb-4 text-right">Price</th>
                  <th className="pb-4 text-right">Value</th>
                  <th className="pb-4 text-right">24h</th>
                </tr>
              </thead>
              <tbody>
                {portfolioHoldings.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-gray-700/50">
                    <td className="py-4 font-semibold">{stock.symbol}</td>
                    <td className="py-4 text-gray-300">{stock.name}</td>
                    <td className="py-4 text-right">{stock.shares}</td>
                    <td className="py-4 text-right">${stock.price}</td>
                    <td className="py-4 text-right">${stock.value.toLocaleString()}</td>
                    <td className={`py-4 text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
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
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Daily Return</p>
              <p className="text-2xl font-bold text-green-400">+1.2%</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Weekly Return</p>
              <p className="text-2xl font-bold text-red-400">-0.8%</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Monthly Return</p>
              <p className="text-2xl font-bold text-green-400">+5.3%</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Yearly Return</p>
              <p className="text-2xl font-bold text-green-400">+22.7%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}