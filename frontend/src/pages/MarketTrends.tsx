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

interface AIAdvice {
  summary: string;
  recommendations: string[];
  riskAnalysis: string;
}

export function MarketTrends() {
  const [loading, setLoading] = useState({
    market: true,
    news: true,
    advice: true
  });
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateAIAdvice = async (portfolioData: any) => {
    try {
      console.log('Portfolio data received:', portfolioData);

      const systemPrompt = `You are an AI-powered financial advisor specializing in investment portfolio management. Your goal is to analyze a user's stock holdings, assess risk, and provide actionable investment insights.  

### Guidelines for Response:
-Portfolio Analysis: Assess the user's current investments, diversification, and risk exposure.  
-Risk Level Assessment: Categorize portfolio risk as Low, Medium, or High based on asset allocation.  
-Market Trend Awareness: Factor in historical stock performance and sector trends before giving advice.  
-Investment Strategy Suggestions: Recommend rebalancing strategies such as:  
   - Diversification: If the portfolio is sector-heavy, suggest spreading across industries.  
   - Reallocation: Adjust stock weightage based on risk appetite and financial goals.  
   - Long-term vs Short-term Holdings: Guide users on when to hold or exit positions.  
-Exit & Re-Entry Points: Suggest optimal stock selling or buying prices based on historical patterns.  
-Tax Optimization Tips: If relevant, recommend strategies to minimize capital gains tax.

### Response Format:
Portfolio Summary:
[A brief analysis of the current portfolio state]

Recommendations:
1. [First specific recommendation]
2. [Second specific recommendation]
3. [Third specific recommendation]

Risk Analysis:
[Detailed risk assessment and mitigation strategies]`;

      const userPrompt = `Analyze this portfolio data and provide investment advice:
      Holdings: ${JSON.stringify(portfolioData.holdings)}
      Total Value: ${portfolioData.total_value}
      Daily P&L: ${portfolioData.metrics.daily_pl}
      Daily Change: ${portfolioData.metrics.daily_change}%`;

      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama2-70b-4096",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        })
      });

      console.log('Groq API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API Error:', errorData);
        throw new Error(`Failed to get AI advice: ${errorData}`);
      }

      const completion = await response.json();
      console.log('Groq API Response data:', completion);

      const aiResponse = completion.choices[0].message.content;
      console.log('AI Response:', aiResponse);
      
      // Parse the AI response into structured format
      const advice: AIAdvice = {
        summary: aiResponse.split('Recommendations:')[0].trim(),
        recommendations: aiResponse
          .split('Recommendations:')[1]
          .split('Risk Analysis:')[0]
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((r: string) => r.trim()),
        riskAnalysis: aiResponse.split('Risk Analysis:')[1].trim()
      };

      console.log('Parsed advice:', advice);
      setAiAdvice(advice);
    } catch (err) {
      console.error('AI advice generation error:', err);
      setError('Failed to generate AI advice');
    } finally {
      setLoading(prev => ({ ...prev, advice: false }));
    }
  };

  const fetchMarketData = async () => {
    try {
      const [marketResponse, newsResponse, portfolioResponse] = await Promise.all([
        stocksApi.getMarketData(),
        stocksApi.getMarketNews(),
        stocksApi.getPortfolio()
      ]);

      if (marketResponse.data) {
        setMarketData((marketResponse.data as any).chartData);
        setMarketSummary((marketResponse.data as any).summary);
      }
      if (newsResponse.data) {
        setMarketNews((newsResponse.data as any));
      }
      
      // Generate AI advice based on portfolio data
      if (portfolioResponse.data) {
        await generateAIAdvice(portfolioResponse.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Market data fetch error:', err);
      setError('Failed to load market data');
    } finally {
      setLoading({
        market: false,
        news: false,
        advice: false
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
      className="flex-1 p-6 overflow-auto"
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

        <div className="glass-card p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">AI Portfolio Analysis</h2>
          {loading.advice ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : aiAdvice ? (
            <div className="space-y-6">
              <div className="p-4 bg-primary-light rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-accent">Portfolio Summary</h3>
                <p className="text-gray-300">{aiAdvice.summary}</p>
              </div>
              
              <div className="p-4 bg-primary-light rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-accent">Recommendations</h3>
                <ul className="list-disc list-inside space-y-2">
                  {aiAdvice.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300">{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-primary-light rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-accent">Risk Analysis</h3>
                <p className="text-gray-300">{aiAdvice.riskAnalysis}</p>
              </div>
            </div>
          ) : null}
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