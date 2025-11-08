export interface User {
  id: string;
  email: string;
  username: string;
  token: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'milk' | 'vegetables' | 'fruits' | 'other';
  quantity: number;
  reorderThreshold: number;
  lastUpdated: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
}

export interface SalesData {
  date: string;
  sales: number;
  items: { name: string; quantity: number; amount: number }[];
}

export interface Prediction {
  item: string;
  quantity: number;
  daysUntil: number;
  reason: string;
}

export type Period = 'day' | 'week' | 'month' | 'year';
