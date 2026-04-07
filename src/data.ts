import { Stock, NewsItem } from './types';

export const MOCK_STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.50, change: 45.20, changePercent: 1.56, volume: 5400000, marketCap: '19.8T', high: 2960.00, low: 2910.00 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.30, change: -12.40, changePercent: -0.30, volume: 1200000, marketCap: '14.9T', high: 4150.00, low: 4100.00 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1450.75, change: 5.15, changePercent: 0.36, volume: 8900000, marketCap: '11.2T', high: 1465.00, low: 1440.00 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1680.20, change: -25.60, changePercent: -1.50, volume: 3400000, marketCap: '6.9T', high: 1710.00, low: 1675.00 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1085.40, change: 18.90, changePercent: 1.77, volume: 4500000, marketCap: '7.6T', high: 1095.00, low: 1065.00 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1210.15, change: 32.45, changePercent: 2.75, volume: 2100000, marketCap: '6.8T', high: 1225.00, low: 1180.00 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 765.80, change: -8.20, changePercent: -1.06, volume: 12500000, marketCap: '6.8T', high: 780.00, low: 760.00 },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'Reliance Retail expands presence in tier-2 cities', source: 'Economic Times', time: '10m ago', sentiment: 'positive' },
  { id: '2', title: 'TCS reports strong Q4 earnings, beats estimates', source: 'Moneycontrol', time: '25m ago', sentiment: 'positive' },
  { id: '3', title: 'Inflation concerns weigh on market sentiment', source: 'Reuters', time: '1h ago', sentiment: 'negative' },
  { id: '4', title: 'HDFC Bank to raise funds via infrastructure bonds', source: 'Bloomberg', time: '2h ago', sentiment: 'neutral' },
];
