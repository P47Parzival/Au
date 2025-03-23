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

interface PolygonMarketData {
  marketStatus: string;
  tickerDetails: any[];
  aggregates: any[];
  lastTrade: any;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const userMessage = input.toLowerCase();
      setInput('');

      const newMessages: Message[] = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);

      // Send message to backend API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          <h1 className="text-xl font-semibold">AI Financial Advisor</h1>
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-primary-light text-adaptive'
                      : 'bg-accent text-primary'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-primary-light p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
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
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
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