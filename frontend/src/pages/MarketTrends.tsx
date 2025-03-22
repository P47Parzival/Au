import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

const marketData = {
  labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'],
  datasets: [
    {
      label: 'S&P 500',
      data: [4200, 4220, 4180, 4250, 4230, 4280, 4260, 4300, 4290, 4310],
      borderColor: '#00FF94',
      tension: 0.4,
    },
    {
      label: 'NASDAQ',
      data: [14100, 14150, 14080, 14200, 14180, 14250, 14220, 14300, 14280, 14320],
      borderColor: '#7B3FE4',
      tension: 0.4,
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

const marketNews = [
  {
    title: "Fed Signals Potential Rate Cuts in Coming Months",
    source: "Financial Times",
    time: "2 hours ago",
    impact: "Positive",
  },
  {
    title: "Tech Stocks Rally on AI Advancements",
    source: "Reuters",
    time: "4 hours ago",
    impact: "Positive",
  },
  {
    title: "Oil Prices Surge Amid Global Supply Concerns",
    source: "Bloomberg",
    time: "6 hours ago",
    impact: "Negative",
  },
  {
    title: "Major Crypto Exchange Announces New Trading Features",
    source: "CoinDesk",
    time: "8 hours ago",
    impact: "Neutral",
  },
];

export function MarketTrends() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pb-6 w-[80%] absolute right-6"
    >
      <h1 className="text-3xl font-bold mb-8">Market Trends</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <Line data={marketData} options={chartOptions} />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">S&P 500</p>
              <p className="text-2xl font-bold text-green-400">4,310.24</p>
              <p className="text-sm text-green-400">+0.75%</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">NASDAQ</p>
              <p className="text-2xl font-bold text-green-400">14,320.55</p>
              <p className="text-sm text-green-400">+1.25%</p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">VIX</p>
              <p className="text-2xl font-bold text-red-400">18.45</p>
              <p className="text-sm text-red-400">-5.30%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Market News</h2>
          <div className="space-y-4">
            {marketNews.map((news, index) => (
              <div key={index} className="p-4 bg-primary-light rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{news.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    news.impact === 'Positive' ? 'bg-green-400/20 text-green-400' :
                    news.impact === 'Negative' ? 'bg-red-400/20 text-red-400' :
                    'bg-gray-400/20 text-gray-400'
                  }`}>
                    {news.impact}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Sector Performance</h2>
          <div className="space-y-3">
            {[
              { sector: 'Technology', change: '+2.1%' },
              { sector: 'Healthcare', change: '+0.8%' },
              { sector: 'Finance', change: '-0.3%' },
              { sector: 'Energy', change: '+1.5%' },
              { sector: 'Consumer', change: '-0.5%' },
            ].map((sector, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
                <span>{sector.sector}</span>
                <span className={sector.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                  {sector.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}