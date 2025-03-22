import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

const ANGEL_API_KEY = import.meta.env.VITE_ANGEL_API_KEY;
const ANGEL_SECRET_KEY = import.meta.env.VITE_ANGEL_SECRET_KEY;

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

const STOCK_SYMBOLS = [
  { symbol: 'RELIANCE', token: '2885' },
  { symbol: 'TCS', token: '11536' },
  { symbol: 'HDFCBANK', token: '341' },
  { symbol: 'INFY', token: '1594' },
  { symbol: 'SBIN', token: '3045' },
  { symbol: 'ICICIBANK', token: '1270' },
  { symbol: 'BHARTIARTL', token: '10604' },
  { symbol: 'HINDUNILVR', token: '1394' }
];

const MarketScanner = () => {
  interface StockData {
    symbol: string;
    price?: number;
    change?: number;
    high?: number;
    low?: number;
    volume?: number;
  }
  
  interface CandleData {
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');

  const fetchStocksData = async () => {
    setLoading(true);
    try {
      const promises = STOCK_SYMBOLS.map(async (stock) => {
        const response = await axios.get('https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData', {
          headers: {
            'X-PrivateKey': ANGEL_SECRET_KEY,
            'Accept': 'application/json',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': '127.0.0.1',
            'X-ClientPublicIP': '127.0.0.1',
            'X-MACAddress': '00:00:00:00:00:00',
            'X-UserType': 'USER',
            'Authorization': `Bearer ${ANGEL_API_KEY}`,
          },
          params: {
            exchange: 'NSE',
            symboltoken: stock.token,
            interval: timeframe === '1D' ? 'FIFTEEN_MINUTE' : 'ONE_DAY',
            fromdate: new Date(Date.now() - (timeframe === '1D' ? 1 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            todate: new Date().toISOString()
          }
        });

        const data = response.data.data || [];
        if (data.length > 0) {
          const lastCandle = data[data.length - 1] as CandleData;
          const prevCandle = data[data.length - 2] as CandleData;
          const change = ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100;

          return {
            ...stock,
            price: lastCandle.close,
            change,
            high: Math.max(...data.map((d: CandleData) => d.high)),
            low: Math.min(...data.map((d: CandleData) => d.low)),
            volume: data.reduce((sum: number, d: CandleData) => sum + d.volume, 0)
          };
        }
        return stock;
      });

      const results = await Promise.all(promises);
      setStocksData(results);
    } catch (error) {
      console.error('Error fetching stocks data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStocksData();
    const interval = setInterval(fetchStocksData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <div className="glass-card p-6 lg:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Market Scanner</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('1D')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === '1D' ? 'bg-accent text-primary' : 'bg-primary-light'
            }`}
          >
            1D
          </button>
          <button
            onClick={() => setTimeframe('30D')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === '30D' ? 'bg-accent text-primary' : 'bg-primary-light'
            }`}
          >
            30D
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-4">Symbol</th>
                <th className="pb-4 text-right">Price</th>
                <th className="pb-4 text-right">Change</th>
                <th className="pb-4 text-right">High</th>
                <th className="pb-4 text-right">Low</th>
                <th className="pb-4 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.map((stock) => (
                <tr key={stock.symbol} className="border-b border-gray-700/50">
                  <td className="py-4 font-semibold">{stock.symbol}</td>
                  <td className="py-4 text-right">₹{stock.price?.toFixed(2) || '-'}</td>
                  <td className={`py-4 text-right ${
                    (stock.change ?? 0) > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.change ? `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}%` : '-'}
                  </td>
                  <td className="py-4 text-right">₹{stock.high?.toFixed(2) || '-'}</td>
                  <td className="py-4 text-right">₹{stock.low?.toFixed(2) || '-'}</td>
                  <td className="py-4 text-right">{stock.volume?.toLocaleString() || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export function MarketTrends() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
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

        <MarketScanner />
      </div>

    </motion.div>
  );
}
