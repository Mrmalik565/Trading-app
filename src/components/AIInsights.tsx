import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Stock } from '../types';
import { cn } from '../lib/utils';

interface AIInsightsProps {
  stock: Stock;
}

export default function AIInsights({ stock }: AIInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the stock ${stock.symbol} (${stock.name}). 
        Current Price: ${stock.price}, Change: ${stock.changePercent}%.
        Provide a brief technical analysis including:
        1. Trend Prediction (Bullish/Bearish/Neutral)
        2. Key Support and Resistance levels
        3. Risk analysis
        4. Sentiment based on current market data.
        Keep it concise and professional for a trading dashboard. Use markdown formatting.`
      });
      setInsight(response.text || 'No analysis available.');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setInsight('AI Analysis is currently unavailable. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <BrainCircuit size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">AI Market Insights</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>
        
        {!insight && !loading && (
          <button 
            onClick={generateInsight}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
          >
            <BrainCircuit size={14} />
            Generate Analysis
          </button>
        )}
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="text-purple-500 animate-spin" size={32} />
            <p className="text-sm text-muted-foreground animate-pulse">Analyzing market patterns and sentiment...</p>
          </div>
        ) : insight ? (
          <div className="space-y-4">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{insight}</ReactMarkdown>
            </div>
            <button 
              onClick={() => setInsight(null)}
              className="text-[10px] text-muted-foreground hover:text-purple-400 transition-colors"
            >
              Clear analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightPreviewCard 
              icon={TrendingUp} 
              title="Trend Prediction" 
              desc="AI-powered direction forecasting"
              color="emerald"
            />
            <InsightPreviewCard 
              icon={AlertTriangle} 
              title="Risk Assessment" 
              desc="Volatility and exposure analysis"
              color="amber"
            />
            <InsightPreviewCard 
              icon={BrainCircuit} 
              title="Sentiment Analysis" 
              desc="News and social media impact"
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InsightPreviewCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors group cursor-default">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", `bg-${color}-500/10 text-${color}-500`)}>
        <Icon size={16} />
      </div>
      <h4 className="text-xs font-bold mb-1">{title}</h4>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
