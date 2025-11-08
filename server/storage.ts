import type { InventoryItem, InsertInventoryItem, Notification, InsertNotification } from "../shared/schema";

export interface IStorage {
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem>;
  deleteInventoryItem(id: string): Promise<void>;
  
  getNotifications(): Promise<Notification[]>;
  getNotification(id: string): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<Notification>;
  deleteNotification(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private inventoryItems: InventoryItem[] = [
    {
      id: "1",
      name: "Laptop",
      quantity: 10,
      category: "Electronics",
      location: "Warehouse A",
      reorderThreshold: 5,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Office Chair",
      quantity: 25,
      category: "Furniture",
      location: "Warehouse B",
      reorderThreshold: 10,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Printer",
      quantity: 5,
      category: "Electronics",
      location: "Warehouse A",
      reorderThreshold: 3,
      lastUpdated: new Date().toISOString(),
    },
  ];
  
  private notifications: Notification[] = [
    {
      id: "1",
      message: "Low stock alert: Printer quantity is below threshold",
      type: "warning",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];
  
  private nextInventoryId = 4;
  private nextNotificationId = 2;

  async getInventoryItems(): Promise<InventoryItem[]> {
    return this.inventoryItems;
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.find(item => item.id === id);
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: String(this.nextInventoryId++),
      lastUpdated: new Date().toISOString(),
    };
    this.inventoryItems.push(newItem);
    return newItem;
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const index = this.inventoryItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("Inventory item not found");
    }
    this.inventoryItems[index] = {
      ...this.inventoryItems[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    return this.inventoryItems[index];
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const index = this.inventoryItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("Inventory item not found");
    }
    this.inventoryItems.splice(index, 1);
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notifications;
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.find(notif => notif.id === id);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: String(this.nextNotificationId++),
      timestamp: new Date().toISOString(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<Notification> {
    const index = this.notifications.findIndex(notif => notif.id === id);
    if (index === -1) {
      throw new Error("Notification not found");
    }
    this.notifications[index].read = true;
    return this.notifications[index];
  }

  async deleteNotification(id: string): Promise<void> {
    const index = this.notifications.findIndex(notif => notif.id === id);
    if (index === -1) {
      throw new Error("Notification not found");
    }
    this.notifications.splice(index, 1);
  }
}

export const storage = new MemStorage();
