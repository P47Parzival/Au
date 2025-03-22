import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { stocksApi } from '../services/api';

interface MarketData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }>;
}

interface MarketNews {
  title: string;
  source: string;
  time: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
}

interface MarketSummary {
  sp500: { value: number; change: number };
  nasdaq: { value: number; change: number };
  vix: { value: number; change: number };
}

export function MarketTrends() {
  const [loading, setLoading] = useState({
    market: true,
    news: true
  });
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const [marketResponse, newsResponse] = await Promise.all([
        stocksApi.getMarketData(),
        stocksApi.getMarketNews()
      ]);

      setMarketData(marketResponse.chartData);
      setMarketSummary(marketResponse.summary);
      setMarketNews(newsResponse.news);
      setError(null);
    } catch (err) {
      console.error('Market data fetch error:', err);
      setError('Failed to load market data');
    } finally {
      setLoading({
        market: false,
        news: false
      });
    }
  };

  if (loading.market || loading.news) {
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
      <h1 className="text-3xl font-bold mb-8">Market Trends</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          {marketData && <Line data={marketData} options={chartOptions} />}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
          {marketSummary && (
            <div className="space-y-4">
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-gray-400">S&P 500</p>
                <p className="text-2xl font-bold text-green-400">{marketSummary.sp500.value.toLocaleString()}</p>
                <p className={`text-sm ${marketSummary.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketSummary.sp500.change >= 0 ? '+' : ''}{marketSummary.sp500.change}%
                </p>
              </div>
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-gray-400">NASDAQ</p>
                <p className="text-2xl font-bold text-green-400">{marketSummary.nasdaq.value.toLocaleString()}</p>
                <p className={`text-sm ${marketSummary.nasdaq.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketSummary.nasdaq.change >= 0 ? '+' : ''}{marketSummary.nasdaq.change}%
                </p>
              </div>
              <div className="p-4 bg-primary-light rounded-lg">
                <p className="text-gray-400">VIX</p>
                <p className="text-2xl font-bold text-red-400">{marketSummary.vix.value.toLocaleString()}</p>
                <p className={`text-sm ${marketSummary.vix.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketSummary.vix.change >= 0 ? '+' : ''}{marketSummary.vix.change}%
                </p>
              </div>
            </div>
          )}
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