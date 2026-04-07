import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  List, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chart', icon: TrendingUp, label: 'Trading' },
    { id: 'portfolio', icon: PieChart, label: 'Portfolio' },
    { id: 'watchlist', icon: List, label: 'Watchlist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-20 lg:w-64 border-r border-border/50 flex flex-col glass z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight hidden lg:block">Zenith<span className="text-blue-500">Trade</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-blue-600/10 text-blue-500 border border-blue-500/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-transform duration-200 group-hover:scale-110",
              activeTab === item.id ? "text-blue-500" : "text-muted-foreground"
            )} />
            <span className="font-medium hidden lg:block">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 hidden lg:block shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border/50">
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group">
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}
