import React from 'react';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  History,
  Briefcase,
  Layers
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { cn, formatCurrency, formatNumber } from '../lib/utils';
import { Position, Order } from '../types';

interface PortfolioProps {
  positions: Position[];
  balance: number;
  orders: Order[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Portfolio({ positions, balance, orders }: PortfolioProps) {
  const totalInvestment = positions.reduce((acc, pos) => acc + (pos.avgPrice * pos.quantity), 0);
  const currentValue = positions.reduce((acc, pos) => acc + (pos.currentPrice * pos.quantity), 0);
  const totalPnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  const allocationData = positions.map(pos => ({
    name: pos.symbol,
    value: pos.currentPrice * pos.quantity
  }));

  const performanceData = [
    { name: 'Mon', value: 145000 },
    { name: 'Tue', value: 148000 },
    { name: 'Wed', value: 147500 },
    { name: 'Thu', value: 152000 },
    { name: 'Fri', value: 150000 + totalPnl },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Investment</p>
          <h3 className="text-xl font-bold font-mono">{formatCurrency(totalInvestment)}</h3>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Value</p>
          <h3 className="text-xl font-bold font-mono">{formatCurrency(currentValue)}</h3>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total P&L</p>
          <div className="flex items-baseline gap-2">
            <h3 className={cn("text-xl font-bold font-mono", totalPnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
              {formatCurrency(totalPnl)}
            </h3>
            <span className={cn("text-xs font-bold", totalPnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
              ({totalPnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Available Cash</p>
          <h3 className="text-xl font-bold font-mono text-blue-400">{formatCurrency(balance)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-2xl p-6 h-[400px]">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Portfolio Performance
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} domain={['dataMin - 5000', 'dataMax + 5000']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Briefcase size={18} className="text-blue-500" />
                Current Holdings
              </h3>
              <span className="text-xs text-muted-foreground">{positions.length} Assets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Instrument</th>
                    <th className="px-6 py-4">Qty.</th>
                    <th className="px-6 py-4">Avg. Price</th>
                    <th className="px-6 py-4">LTP</th>
                    <th className="px-6 py-4">Cur. Value</th>
                    <th className="px-6 py-4 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {positions.map((pos) => (
                    <tr key={pos.symbol} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-[10px]">
                            {pos.symbol.slice(0, 2)}
                          </div>
                          <span className="font-bold">{pos.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">{pos.quantity}</td>
                      <td className="px-6 py-4 font-mono text-sm">{formatNumber(pos.avgPrice)}</td>
                      <td className="px-6 py-4 font-mono text-sm">{formatNumber(pos.currentPrice)}</td>
                      <td className="px-6 py-4 font-mono text-sm">{formatNumber(pos.currentPrice * pos.quantity)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={cn("font-mono font-bold text-sm", pos.pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                          {pos.pnl >= 0 ? '+' : ''}{formatNumber(pos.pnl)}
                        </div>
                        <div className={cn("text-[10px]", pos.pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                          {pos.pnlPercent.toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              Asset Allocation
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <History size={18} className="text-blue-500" />
              Recent Orders
            </h3>
            <div className="space-y-4">
              {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold",
                      order.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {order.type}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{order.symbol}</p>
                      <p className="text-[10px] text-muted-foreground">{order.quantity} qty • {formatNumber(order.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-bold uppercase">
                      {order.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <History size={32} className="text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No recent orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
