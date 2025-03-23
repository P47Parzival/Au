import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = document.documentElement.classList.contains('light-mode') ? false : true;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          width: '100%',
          height: '700',
          symbol: 'BINANCE:BTCUSDT',
          interval: '1D',
          timezone: 'Etc/UTC',
          theme: isDarkMode ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          watchlist: [
            'NASDAQ:AAPL',
            'NASDAQ:GOOGL',
            'NASDAQ:MSFT',
            'NYSE:BAC',
            'BINANCE:BTCUSDT',
            'BINANCE:ETHUSDT',
            'BINANCE:BNBUSDT',
            'FX:EURUSD',
            'FX:GBPUSD',
            'FX:USDJPY'
          ],
          details: true,
          hotlist: true,
          calendar: true,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          container_id: containerRef.current.id,
          library_path: '/charting_library/',
          toolbar_bg: isDarkMode ? '#1e293b' : '#f8fafc',
          loading_screen: { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" },
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#4ade80",
            "mainSeriesProperties.candleStyle.downColor": "#f43f5e",
            "mainSeriesProperties.candleStyle.wickUpColor": "#4ade80",
            "mainSeriesProperties.candleStyle.wickDownColor": "#f43f5e"
          },
          disabled_features: [
            "header_screenshot"
          ],
          enabled_features: [
            "study_templates",
            "hide_left_toolbar_by_default",
            "compare_symbol"
          ]
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [isDarkMode]);

  return (
    <div className="p-6 w-full max-w-[1400px] mx-auto fade-in">
      <h1 className="page-title mb-8">Trading Charts</h1>
      
      <div className="glass-card p-0 overflow-hidden mb-8 transition-all">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color">
          <div className="text-adaptive font-medium">Real-time market data</div>
          <div className="text-adaptive-secondary text-sm">
            Powered by TradingView
          </div>
        </div>
        
        <div 
          id="tradingview_widget" 
          ref={containerRef} 
          className="w-full"
          style={{ height: '700px' }}
        />
      </div>
      
   
      
      <div className="text-adaptive-secondary text-sm mt-4">
        Data is provided for informational purposes only. Au does not guarantee accuracy or timeliness of the information displayed.
      </div>
    </div>
  );
};