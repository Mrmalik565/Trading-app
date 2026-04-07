import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  List, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  Globe,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatNumber } from './lib/utils';
import { Stock, Position, Order, NewsItem } from './types';
import { MOCK_STOCKS, MOCK_NEWS } from './data';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChartScreen from './components/ChartScreen';
import Portfolio from './components/Portfolio';
import WatchlistPage from './components/WatchlistPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStock, setSelectedStock] = useState<Stock>(MOCK_STOCKS[0]);
  const [watchlist, setWatchlist] = useState<Stock[]>(MOCK_STOCKS.slice(0, 4));
  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'RELIANCE', quantity: 10, avgPrice: 2850, currentPrice: 2945.50, pnl: 955, pnlPercent: 3.35 },
    { symbol: 'INFY', quantity: 25, avgPrice: 1720, currentPrice: 1680.20, pnl: -995, pnlPercent: -2.31 },
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [balance, setBalance] = useState(150000);

  const handleTrade = (order: Order) => {
    setOrders([order, ...orders]);
    // Simple logic for mock balance update
    if (order.type === 'BUY') {
      setBalance(prev => prev - (order.price * order.quantity));
    } else {
      setBalance(prev => prev + (order.price * order.quantity));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          stocks={MOCK_STOCKS} 
          onSelectStock={(s) => { setSelectedStock(s); setActiveTab('chart'); }}
          positions={positions}
          balance={balance}
        />;
      case 'chart':
        return <ChartScreen 
          stock={selectedStock} 
          onTrade={handleTrade}
          balance={balance}
        />;
      case 'portfolio':
        return <Portfolio positions={positions} balance={balance} orders={orders} />;
      case 'watchlist':
        return <WatchlistPage 
          watchlist={watchlist} 
          onSelectStock={(s) => { setSelectedStock(s); setActiveTab('chart'); }}
          onRemove={(s) => setWatchlist(watchlist.filter(item => item.symbol !== s.symbol))}
        />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard 
          stocks={MOCK_STOCKS} 
          onSelectStock={(s) => { setSelectedStock(s); setActiveTab('chart'); }}
          positions={positions}
          balance={balance}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 glass z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-border/50">
              <Search size={14} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search stocks, indices..." 
                className="bg-transparent border-none outline-none text-xs w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Nifty 50</span>
                <span className="text-sm font-mono font-medium text-emerald-400">22,453.20 (+0.85%)</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sensex</span>
                <span className="text-sm font-mono font-medium text-emerald-400">73,903.91 (+0.72%)</span>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-border/50 hidden lg:block" />

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-background" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-border/50">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium">Jatin Malik</span>
                  <span className="text-[10px] text-muted-foreground">Pro Trader</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                  JM
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
