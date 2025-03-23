import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          width: '100%',
          height: '800',
          symbol: 'BINANCE:BTCUSDT',
          interval: '1D',
          timezone: 'Etc/UTC',
          theme: 'dark',
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
          toolbar_bg: '#1a1a1a',
          loading_screen: { backgroundColor: "#1a1a1a" },
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#26a69a",
            "mainSeriesProperties.candleStyle.downColor": "#ef5350",
            "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350"
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
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Trading Charts</h1>
      <div className="flex flex-col items-center gap-4">
        <div 
          id="tradingview_widget" 
          ref={containerRef} 
          className="w-[1175px] rounded-lg shadow-lg bg-gray-900 ml-4"
          style={{ height: '800px' }}
        />
        <div className="text-sm text-gray-400 ml-24">
        </div>
      </div>
    </div>
  );
};