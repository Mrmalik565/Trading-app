import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function generateMockCandlestickData(count: number, basePrice: number) {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * (open * 0.02);
    const high = Math.max(open, close) + Math.random() * (open * 0.005);
    const low = Math.min(open, close) - Math.random() * (open * 0.005);
    const volume = Math.floor(Math.random() * 1000000);
    
    const time = new Date(now.getTime() - (count - i) * 60000); // 1 min intervals

    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
      volume,
    });
    currentPrice = close;
  }
  return data;
}
