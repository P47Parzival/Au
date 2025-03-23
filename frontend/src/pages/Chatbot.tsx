import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { stocksApi } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
  metrics: {
    daily_change: number;
    total_investments: number;
    daily_pl: number;
  };
  marketData?: PolygonMarketData;
}

interface SuggestionCategory {
  portfolio: string[];
  risk: string[];
  holdings: string[];
  general: string[];
}

interface PolygonMarketData {
  marketStatus: string;
  tickerDetails: any[];
  aggregates: any[];
  lastTrade: any;
}

const fetchPolygonData = async (symbol: string) => {
  const POLYGON_API_KEY = "8fPQIpnUXXEiPxZDkzOpZNLehLMoVzKc";
  const baseUrl = "https://api.polygon.io/v2";
  
  try {
    const [marketStatus, tickerDetails, aggregates, lastTrade] = await Promise.all([
      fetch(`${baseUrl}/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`),
      fetch(`${baseUrl}/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`),
      fetch(`${baseUrl}/aggs/ticker/${symbol}/range/1/day/2024-01-01/${new Date().toISOString().split('T')[0]}?apiKey=${POLYGON_API_KEY}`),
      fetch(`${baseUrl}/last/trade/${symbol}?apiKey=${POLYGON_API_KEY}`)
    ]);

    return {
      marketStatus: await marketStatus.json(),
      tickerDetails: await tickerDetails.json(),
      aggregates: await aggregates.json(),
      lastTrade: await lastTrade.json()
    };
  } catch (error) {
    console.error('Polygon API Error:', error);
    return null;
  }
};

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  const followUpQuestions: SuggestionCategory = {
    portfolio: [
      "How can I improve my portfolio performance?",
      "What sectors should I invest in?",
      "Is my portfolio well-diversified?",
      "What's my overall profit/loss?"
    ],
    risk: [
      "How can I reduce my portfolio risk?",
      "Which stocks are most volatile?",
      "Should I rebalance my portfolio?",
      "What's my risk-adjusted return?"
    ],
    holdings: [
      "Which stock is performing best?",
      "Should I sell any positions?",
      "What's my average holding period?",
      "Where should I invest more?"
    ],
    general: [
      "What is portfolio diversification?",
      "How do I calculate returns?",
      "What's the best investment strategy?",
      "How to manage investment risks?"
    ]
  };

  useEffect(() => {
    fetchPortfolioData();
    // Refresh data every minute
    const interval = setInterval(fetchPortfolioData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setPortfolioLoading(true);
      const response = await stocksApi.getPortfolio();
      if (response.status && response.data) {
        setPortfolioData(response.data);
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const userMessage = input.toLowerCase();
      setInput('');

      const newMessages: Message[] = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);

      if (!portfolioData) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: 'Still loading your portfolio data. Please try again in a moment.'
        }]);
        return;
      }

      // Handle basic portfolio queries locally
      if (userMessage.includes('portfolio overview') || userMessage.includes('summary') || 
          userMessage.includes('show portfolio') || userMessage.includes('how am i doing')) {
        const { total_value, metrics, holdings } = portfolioData;
        const response = `📊 Portfolio Overview:
💰 Total Value: ₹${total_value.toLocaleString()}
📈 Today's P&L: ₹${metrics.daily_pl.toLocaleString()} (${metrics.daily_change.toFixed(2)}%)
💵 Total Investment: ₹${metrics.total_investments.toLocaleString()}
🏢 Total Stocks: ${holdings.length}

${metrics.daily_change >= 0 
  ? "Your portfolio is performing well today!" 
  : "Your portfolio is showing some decline today. Stay calm and focused on your long-term strategy."}`;

        setMessages([...newMessages, { role: 'assistant', content: response }]);
        setLoading(false);
        return;
      }

      // Handle holdings query locally
      if (userMessage.includes('holdings') || userMessage.includes('stocks') || 
          userMessage.includes('what do i own')) {
        const response = `📈 Your Current Holdings:\n\n${
          portfolioData.holdings.map(holding => 
            `🏢 ${holding.tradingsymbol}:
   Quantity: ${holding.quantity}
   Buy Price: ₹${holding.averageprice.toLocaleString()}
   Current: ₹${holding.ltp.toLocaleString()}
   P&L: ₹${holding.profitandloss.toLocaleString()} (${holding.pnlpercentage.toFixed(2)}%)\n`
          ).join('\n')
        }`;

        setMessages([...newMessages, { role: 'assistant', content: response }]);
        setLoading(false);
        return;
      }

      // For other queries, use the backend API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userPortfolio: portfolioData,
          message: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getRelevantFollowUps = (lastMessage: string): string[] => {
    if (!lastMessage) return followUpQuestions.general;
    
    lastMessage = lastMessage.toLowerCase();
    
    if (lastMessage.includes('portfolio') || lastMessage.includes('performance') || lastMessage.includes('overview')) {
      return followUpQuestions.portfolio;
    }
    if (lastMessage.includes('risk') || lastMessage.includes('volatile') || lastMessage.includes('safe')) {
      return followUpQuestions.risk;
    }
    if (lastMessage.includes('holdings') || lastMessage.includes('stocks') || lastMessage.includes('shares')) {
      return followUpQuestions.holdings;
    }
    return followUpQuestions.general;
  };

  const suggestions = [
    "Show me my portfolio overview",
    "What's my risk analysis?",
    "Show my current holdings",
    "What is a mutual fund?",
    "How is the stock market doing?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-accent" />
          <h1 className="text-xl text-black font-semibold">AI Financial Advisor</h1>
          {portfolioLoading && <span className="text-sm text-gray-400 ml-2">(Loading portfolio...)</span>}
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'assistant'
                        ? 'bg-primary-light text-adaptive'
                        : 'bg-accent text-primary'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
                {message.role === 'assistant' && index === messages.length - 1 && (
                  <div className="mt-4 mb-6">
                    <p className="text-sm text-adaptive-secondary mb-2">Follow-up questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getRelevantFollowUps(message.content).slice(0, 3).map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(question);
                            sendMessage();
                          }}
                          className="px-3 py-1.5 text-sm bg-primary-light/50 text-adaptive rounded-lg 
                                   hover:bg-accent hover:text-primary transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-primary-light p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            {messages.length === 0 && (
              <>
                <div className="text-center text-adaptive-secondary mt-8 mb-4">
                  Ask me about your portfolio, investment risks, or general financial questions!
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(suggestion);
                        sendMessage();
                      }}
                      className="px-3 py-2 bg-primary-light text-adaptive rounded-lg hover:bg-accent hover:text-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && input.trim() && sendMessage()}
                placeholder="Ask about your portfolio..."
                className="flex-1 bg-primary-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={loading || portfolioLoading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || portfolioLoading || !input.trim()}
                className="px-4 py-2 bg-accent text-primary rounded-lg disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}