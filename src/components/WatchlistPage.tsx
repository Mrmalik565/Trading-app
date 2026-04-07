import React from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Search,
  ArrowUpRight,
  Bell
} from 'lucide-react';
import { cn, formatNumber } from '../lib/utils';
import { Stock } from '../types';

interface WatchlistPageProps {
  watchlist: Stock[];
  onSelectStock: (stock: Stock) => void;
  onRemove: (stock: Stock) => void;
}

export default function WatchlistPage({ watchlist, onSelectStock, onRemove }: WatchlistPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Watchlist</h2>
          <p className="text-sm text-muted-foreground">Monitor your favorite stocks and indices</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Add stock..." 
              className="bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500/50 transition-colors w-64"
            />
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((stock) => (
          <div 
            key={stock.symbol}
            className="glass rounded-2xl p-5 group hover:border-blue-500/30 transition-all cursor-pointer"
            onClick={() => onSelectStock(stock)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-xs">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold">{stock.symbol}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{stock.name}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <Bell size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(stock); }}
                  className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-mono font-bold">{formatNumber(stock.price)}</p>
                <div className="flex items-center gap-1">
                  {stock.change >= 0 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />}
                  <span className={cn(
                    "text-xs font-bold",
                    stock.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                  </span>
                </div>
              </div>
              
              <div className="h-12 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                {/* Mini chart placeholder */}
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <path 
                    d={stock.change >= 0 
                      ? "M0 30 Q 25 10, 50 25 T 100 5" 
                      : "M0 10 Q 25 30, 50 15 T 100 35"} 
                    fill="none" 
                    stroke={stock.change >= 0 ? "#10b981" : "#f43f5e"} 
                    strokeWidth="2" 
                  />
                </svg>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Market Cap: {stock.marketCap}</span>
              <ArrowUpRight size={14} className="text-blue-500" />
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed border-border/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
            <Plus size={24} />
          </div>
          <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-500">Add New Stock</p>
        </button>
      </div>
    </div>
  );
}
