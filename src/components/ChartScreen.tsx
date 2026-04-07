import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Clock, 
  Info,
  ChevronDown,
  Maximize2,
  Settings2,
  Zap,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn, formatCurrency, formatNumber, generateMockCandlestickData } from '../lib/utils';
import { Stock, Order, Timeframe } from '../types';
import AIInsights from './AIInsights';

interface ChartScreenProps {
  stock: Stock;
  onTrade: (order: Order) => void;
  balance: number;
}

export default function ChartScreen({ stock, onTrade, balance }: ChartScreenProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [data, setData] = useState(generateMockCandlestickData(50, stock.price));
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);

  useEffect(() => {
    setData(generateMockCandlestickData(50, stock.price));
    setPrice(stock.price);
  }, [stock]);

  const handlePlaceOrder = () => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: stock.symbol,
      type: orderType,
      orderType: 'MARKET',
      quantity,
      price: stock.price,
      status: 'EXECUTED',
      timestamp: new Date(),
    };
    onTrade(order);
  };

  const [indicators, setIndicators] = useState<string[]>(['MA']);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const chartDataWithIndicators = useMemo(() => {
    return data.map((d, i) => {
      const ma = data.slice(Math.max(0, i - 10), i + 1).reduce((acc, curr) => acc + curr.close, 0) / (Math.min(i, 10) + 1);
      const ema = i === 0 ? d.close : (d.close - data[i-1].close) * (2 / (10 + 1)) + data[i-1].close;
      return {
        ...d,
        ma: indicators.includes('MA') ? ma : null,
        ema: indicators.includes('EMA') ? ema : null,
        upper: indicators.includes('BB') ? ma + 50 : null,
        lower: indicators.includes('BB') ? ma - 50 : null,
      };
    });
  }, [data, indicators]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Side - Chart & Info */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Stock Header */}
        <div className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold text-lg">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{stock.symbol}</h2>
                <span className="px-2 py-0.5 bg-secondary text-[10px] font-bold rounded uppercase text-muted-foreground">NSE</span>
              </div>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Price</p>
              <p className="text-2xl font-mono font-bold">{formatNumber(stock.price)}</p>
              <p className={cn(
                "text-xs font-medium",
                stock.change >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day High</p>
              <p className="text-sm font-mono font-bold">{formatNumber(stock.high)}</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Low</p>
              <p className="text-sm font-mono font-bold">{formatNumber(stock.low)}</p>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="glass rounded-2xl p-6 flex-1 flex flex-col min-h-[450px]">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex bg-secondary/50 p-1 rounded-xl">
                {(['1m', '5m', '15m', '1H', '1D', '1W'] as Timeframe[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                      timeframe === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="h-6 w-[1px] bg-border/50 mx-2" />
              <div className="flex bg-secondary/50 p-1 rounded-xl">
                <button 
                  onClick={() => setChartType('candle')}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    chartType === 'candle' ? "bg-secondary-foreground/10 text-foreground" : "text-muted-foreground"
                  )}
                >
                  <BarChart3 size={16} />
                </button>
                <button 
                  onClick={() => setChartType('line')}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    chartType === 'line' ? "bg-secondary-foreground/10 text-foreground" : "text-muted-foreground"
                  )}
                >
                  <TrendingUp size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['MA', 'EMA', 'BB', 'RSI'].map(id => (
                  <button 
                    key={id}
                    onClick={() => toggleIndicator(id)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded-lg border transition-all",
                      indicators.includes(id) ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <div className="h-6 w-[1px] bg-border/50 mx-2" />
              <button className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                <Settings2 size={18} />
              </button>
              <button className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors">
                <Maximize2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartDataWithIndicators}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#71717a'}} 
                  minTickGap={30}
                />
                <YAxis 
                  orientation="right" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#71717a'}}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px' }}
                  labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontSize: '10px' }}
                />
                {chartType === 'line' ? (
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false} 
                    animationDuration={500}
                  />
                ) : (
                  <Bar dataKey="close" animationDuration={500}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.close >= entry.open ? '#10b981' : '#f43f5e'} 
                      />
                    ))}
                  </Bar>
                )}
                
                {indicators.includes('MA') && <Line type="monotone" dataKey="ma" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="5 5" />}
                {indicators.includes('EMA') && <Line type="monotone" dataKey="ema" stroke="#8b5cf6" strokeWidth={1} dot={false} />}
                {indicators.includes('BB') && (
                  <>
                    <Line type="monotone" dataKey="upper" stroke="#71717a" strokeWidth={1} dot={false} opacity={0.3} />
                    <Line type="monotone" dataKey="lower" stroke="#71717a" strokeWidth={1} dot={false} opacity={0.3} />
                  </>
                )}

                <Bar dataKey="volume" yAxisId={1} opacity={0.1} fill="#71717a" />
                <YAxis yAxisId={1} hide />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis Section */}
        <AIInsights stock={stock} />
      </div>

      {/* Right Side - Trade Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass rounded-2xl p-6 sticky top-6">
          <div className="flex bg-secondary/50 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => setOrderType('BUY')}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold transition-all",
                orderType === 'BUY' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-muted-foreground hover:text-foreground"
              )}
            >
              BUY
            </button>
            <button 
              onClick={() => setOrderType('SELL')}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold transition-all",
                orderType === 'SELL' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-muted-foreground hover:text-foreground"
              )}
            >
              SELL
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-4 py-2 bg-secondary text-xs font-bold rounded-xl border border-blue-500/50 text-blue-400">Market</button>
                <button className="px-4 py-2 bg-secondary/30 text-xs font-bold rounded-xl border border-transparent text-muted-foreground hover:bg-secondary transition-colors">Limit</button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Quantity</label>
                <span className="text-[10px] text-muted-foreground">Max: {Math.floor(balance / stock.price)}</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors font-mono"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-secondary rounded text-muted-foreground">-</button>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-secondary rounded text-muted-foreground">+</button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Price</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formatNumber(stock.price)}
                  disabled
                  className="w-full bg-secondary/20 border border-border/20 rounded-xl px-4 py-3 outline-none text-muted-foreground font-mono"
                />
                <Zap size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" />
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-2xl space-y-2 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Required Margin</span>
                <span className="font-mono font-bold">{formatCurrency(stock.price * quantity)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Available Margin</span>
                <span className="font-mono">{formatCurrency(balance)}</span>
              </div>
              <div className="h-[1px] bg-border/50 my-2" />
              <div className="flex justify-between text-sm">
                <span className="font-bold">Total Est.</span>
                <span className="font-mono font-bold text-blue-400">{formatCurrency(stock.price * quantity)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98]",
                orderType === 'BUY' 
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                  : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
              )}
            >
              Place {orderType} Order
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck size={12} className="text-emerald-500" />
              Secured by ZenithTrade Engine
            </div>
          </div>
        </div>

        {/* Market Depth Mock */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Market Depth
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] text-emerald-500 font-bold uppercase text-center">Bids</p>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between text-[10px] font-mono">
                  <span className="text-emerald-400">{formatNumber(stock.price - i * 0.5)}</span>
                  <span className="text-muted-foreground">{Math.floor(Math.random() * 5000)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-rose-500 font-bold uppercase text-center">Asks</p>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between text-[10px] font-mono">
                  <span className="text-rose-400">{formatNumber(stock.price + i * 0.5)}</span>
                  <span className="text-muted-foreground">{Math.floor(Math.random() * 5000)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
