import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Activity, 
  TrendingDown,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency, formatNumber } from '../lib/utils';
import { Stock, Position, NewsItem } from '../types';
import { MOCK_NEWS } from '../data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  positions: Position[];
  balance: number;
}

const chartData = [
  { name: '9:00', value: 22100 },
  { name: '10:00', value: 22250 },
  { name: '11:00', value: 22180 },
  { name: '12:00', value: 22350 },
  { name: '13:00', value: 22420 },
  { name: '14:00', value: 22380 },
  { name: '15:00', value: 22453 },
];

export default function Dashboard({ stocks, onSelectStock, positions, balance }: DashboardProps) {
  const totalPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const portfolioValue = positions.reduce((acc, pos) => acc + (pos.currentPrice * pos.quantity), 0) + balance;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Stats Overview */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Portfolio" 
            value={formatCurrency(portfolioValue)} 
            change="+2.4%" 
            isPositive={true}
            icon={Wallet}
            color="blue"
          />
          <StatCard 
            title="Day's P&L" 
            value={formatCurrency(totalPnl)} 
            change="+1.2%" 
            isPositive={totalPnl >= 0}
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard 
            title="Available Margin" 
            value={formatCurrency(balance)} 
            change="0.0%" 
            isPositive={true}
            icon={Activity}
            color="purple"
          />
        </div>

        {/* Market Overview Chart */}
        <div className="glass rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Market Overview</h3>
              <p className="text-xs text-muted-foreground">Nifty 50 performance today</p>
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((t) => (
                <button key={t} className={cn(
                  "px-3 py-1 text-xs rounded-lg transition-colors",
                  t === '1D' ? "bg-blue-600 text-white" : "hover:bg-secondary text-muted-foreground"
                )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StockList title="Top Gainers" stocks={stocks.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 4)} onSelect={onSelectStock} />
          <StockList title="Top Losers" stocks={stocks.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 4)} onSelect={onSelectStock} />
        </div>
      </div>

      {/* Right Sidebar - News & Watchlist */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Market News
            </h3>
            <button className="text-xs text-blue-500 hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {MOCK_NEWS.map((news) => (
              <div key={news.id} className="group cursor-pointer">
                <p className="text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2">{news.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">{news.source} • {news.time}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold",
                    news.sentiment === 'positive' ? "bg-emerald-500/10 text-emerald-500" : 
                    news.sentiment === 'negative' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {news.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Quick Watchlist</h3>
            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {stocks.slice(0, 5).map((stock) => (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
                onClick={() => onSelectStock(stock)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-xs">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{stock.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium">{formatNumber(stock.price)}</p>
                  <p className={cn(
                    "text-[10px] font-medium",
                    stock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon, color }: any) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group">
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500",
        `bg-${color}-500`
      )} />
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl", `bg-${color}-500/10 text-${color}-500`)}>
          <Icon size={20} />
        </div>
        <span className={cn(
          "text-xs font-bold flex items-center gap-1",
          isPositive ? "text-emerald-500" : "text-rose-500"
        )}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
  );
}

function StockList({ title, stocks, onSelect }: any) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="space-y-1">
        {stocks.map((stock: Stock) => (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
            onClick={() => onSelect(stock)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-1 h-8 rounded-full",
                stock.change >= 0 ? "bg-emerald-500" : "bg-rose-500"
              )} />
              <div>
                <p className="text-sm font-bold">{stock.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono font-medium">{formatNumber(stock.price)}</p>
              <div className="flex items-center justify-end gap-1">
                {stock.change >= 0 ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                <p className={cn(
                  "text-[10px] font-medium",
                  stock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                )}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
