import axios from 'axios';
import { getAuth } from './auth';
import { InventoryItem, Notification, SalesData, Prediction, Period } from '@/types';

// Base API URL - can be changed to actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Mock data for development (remove when backend is ready)
const generateMockData = () => {
  const items: InventoryItem[] = [
    { id: '1', name: 'Toned Milk', category: 'milk', quantity: 25, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '2', name: 'Full Cream Milk', category: 'milk', quantity: 8, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '3', name: 'Paneer', category: 'milk', quantity: 12, reorderThreshold: 8, lastUpdated: new Date().toISOString() },
    { id: '4', name: 'Tomatoes', category: 'vegetables', quantity: 15, reorderThreshold: 8, lastUpdated: new Date().toISOString() },
    { id: '5', name: 'Onions', category: 'vegetables', quantity: 4, reorderThreshold: 6, lastUpdated: new Date().toISOString() },
    { id: '6', name: 'Potatoes', category: 'vegetables', quantity: 30, reorderThreshold: 15, lastUpdated: new Date().toISOString() },
    { id: '7', name: 'Green Chillies', category: 'vegetables', quantity: 8, reorderThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '8', name: 'Coriander Leaves', category: 'vegetables', quantity: 5, reorderThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '9', name: 'Mangoes', category: 'fruits', quantity: 20, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '10', name: 'Bananas', category: 'fruits', quantity: 3, reorderThreshold: 8, lastUpdated: new Date().toISOString() },
    { id: '11', name: 'Pomegranate', category: 'fruits', quantity: 18, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '12', name: 'Basmati Rice', category: 'other', quantity: 45, reorderThreshold: 20, lastUpdated: new Date().toISOString() },
    { id: '13', name: 'Atta (Wheat Flour)', category: 'other', quantity: 6, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '14', name: 'Toor Dal', category: 'other', quantity: 18, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '15', name: 'Chana Dal', category: 'other', quantity: 15, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
    { id: '16', name: 'Turmeric Powder', category: 'other', quantity: 10, reorderThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '17', name: 'Red Chilli Powder', category: 'other', quantity: 8, reorderThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '18', name: 'Garam Masala', category: 'other', quantity: 12, reorderThreshold: 6, lastUpdated: new Date().toISOString() },
    { id: '19', name: 'Mustard Oil', category: 'other', quantity: 4, reorderThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '20', name: 'Jaggery (Gur)', category: 'other', quantity: 20, reorderThreshold: 10, lastUpdated: new Date().toISOString() },
  ];
  
  localStorage.setItem('inventory_items', JSON.stringify(items));
  return items;
};

// API methods
export const authAPI = {
  signup: async (email: string, password: string, username: string) => {
    try {
      // Mock signup - replace with actual API call
      const mockUser = {
        id: Date.now().toString(),
        email,
        username,
        token: 'mock_token_' + Date.now(),
      };
      return { data: mockUser };
    } catch (error) {
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: Date.now().toString(),
        email,
        username: email.split('@')[0],
        token: 'mock_token_' + Date.now(),
      };
      return { data: mockUser };
    } catch (error) {
      throw error;
    }
  },
};

export const inventoryAPI = {
  getAll: async (): Promise<InventoryItem[]> => {
    try {
      // Mock API - replace with: await api.get('/items')
      let items = localStorage.getItem('inventory_items');
      if (!items) {
        return generateMockData();
      }
      return JSON.parse(items);
    } catch (error) {
      throw error;
    }
  },
  
  create: async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
    try {
      const items = await inventoryAPI.getAll();
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString(),
      };
      items.push(newItem);
      localStorage.setItem('inventory_items', JSON.stringify(items));
      return newItem;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      const items = await inventoryAPI.getAll();
      const index = items.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item not found');
      
      items[index] = { ...items[index], ...item, lastUpdated: new Date().toISOString() };
      localStorage.setItem('inventory_items', JSON.stringify(items));
      return items[index];
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const items = await inventoryAPI.getAll();
      const filtered = items.filter(i => i.id !== id);
      localStorage.setItem('inventory_items', JSON.stringify(filtered));
    } catch (error) {
      throw error;
    }
  },
};

export const analyticsAPI = {
  getSales: async (period: Period, date?: string): Promise<SalesData[]> => {
    try {
      // Mock data - replace with actual API call
      const mockSalesData: SalesData[] = [];
      const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
      
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        mockSalesData.push({
          date: d.toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 5000) + 1000,
          items: [
            { name: 'Basmati Rice', quantity: Math.floor(Math.random() * 20) + 5, amount: Math.random() * 800 + 200 },
            { name: 'Toor Dal', quantity: Math.floor(Math.random() * 15) + 5, amount: Math.random() * 600 + 150 },
            { name: 'Atta', quantity: Math.floor(Math.random() * 10) + 3, amount: Math.random() * 400 + 100 },
          ],
        });
      }
      
      return mockSalesData.reverse();
    } catch (error) {
      throw error;
    }
  },
  
  getPredictions: async (): Promise<Prediction[]> => {
    try {
      // Mock predictions
      return [
        { item: 'Full Cream Milk', quantity: 15, daysUntil: 1, reason: 'Low stock, high demand' },
        { item: 'Onions', quantity: 10, daysUntil: 1, reason: 'Critical low stock' },
        { item: 'Coriander Leaves', quantity: 8, daysUntil: 1, reason: 'Critical low stock' },
        { item: 'Bananas', quantity: 12, daysUntil: 2, reason: 'Low stock alert' },
        { item: 'Atta (Wheat Flour)', quantity: 15, daysUntil: 3, reason: 'Approaching reorder threshold' },
        { item: 'Mustard Oil', quantity: 5, daysUntil: 2, reason: 'Low stock alert' },
      ];
    } catch (error) {
      throw error;
    }
  },
};

export const notificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) return JSON.parse(stored);
      
      const items = await inventoryAPI.getAll();
      const notifications: Notification[] = items
        .filter(item => item.quantity <= item.reorderThreshold)
        .map(item => ({
          id: `notif_${item.id}`,
          message: `Low stock on ${item.name} - ${item.quantity} units remaining. Reorder soon!`,
          type: item.quantity <= 5 ? 'danger' : 'warning' as const,
          timestamp: new Date().toISOString(),
          read: false,
        }));
      
      localStorage.setItem('notifications', JSON.stringify(notifications));
      return notifications;
    } catch (error) {
      throw error;
    }
  },
  
  markAsRead: async (id: string): Promise<void> => {
    try {
      const notifications = await notificationsAPI.getAll();
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      throw error;
    }
  },
};
