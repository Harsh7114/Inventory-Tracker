import { db } from "./db";
import { inventoryItems, notifications } from "./db/schema";
import { eq } from "drizzle-orm";
import type { InventoryItem, InsertInventoryItem, Notification, InsertNotification } from "../shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async getInventoryItems(): Promise<InventoryItem[]> {
    const items = await db.select().from(inventoryItems);
    return items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      location: item.location,
      reorderThreshold: item.reorderThreshold,
      lastUpdated: item.lastUpdated.toISOString(),
    }));
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const items = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    if (items.length === 0) return undefined;
    
    const item = items[0];
    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      location: item.location,
      reorderThreshold: item.reorderThreshold,
      lastUpdated: item.lastUpdated.toISOString(),
    };
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const result = await db.insert(inventoryItems).values({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      location: item.location,
      reorderThreshold: item.reorderThreshold,
    }).returning();
    
    const newItem = result[0];
    return {
      id: newItem.id,
      name: newItem.name,
      quantity: newItem.quantity,
      category: newItem.category,
      location: newItem.location,
      reorderThreshold: newItem.reorderThreshold,
      lastUpdated: newItem.lastUpdated.toISOString(),
    };
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const result = await db.update(inventoryItems)
      .set({
        ...updates,
        lastUpdated: new Date(),
      })
      .where(eq(inventoryItems.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Inventory item not found");
    }
    
    const item = result[0];
    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      location: item.location,
      reorderThreshold: item.reorderThreshold,
      lastUpdated: item.lastUpdated.toISOString(),
    };
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id)).returning();
    if (result.length === 0) {
      throw new Error("Inventory item not found");
    }
  }

  async getNotifications(): Promise<Notification[]> {
    const notifs = await db.select().from(notifications);
    return notifs.map(notif => ({
      id: notif.id,
      message: notif.message,
      type: notif.type as "info" | "warning" | "error" | "success",
      timestamp: notif.timestamp.toISOString(),
      read: notif.read,
    }));
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    const notifs = await db.select().from(notifications).where(eq(notifications.id, id));
    if (notifs.length === 0) return undefined;
    
    const notif = notifs[0];
    return {
      id: notif.id,
      message: notif.message,
      type: notif.type as "info" | "warning" | "error" | "success",
      timestamp: notif.timestamp.toISOString(),
      read: notif.read,
    };
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values({
      message: notification.message,
      type: notification.type,
      read: notification.read,
    }).returning();
    
    const newNotif = result[0];
    return {
      id: newNotif.id,
      message: newNotif.message,
      type: newNotif.type as "info" | "warning" | "error" | "success",
      timestamp: newNotif.timestamp.toISOString(),
      read: newNotif.read,
    };
  }

  async markNotificationRead(id: string): Promise<Notification> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Notification not found");
    }
    
    const notif = result[0];
    return {
      id: notif.id,
      message: notif.message,
      type: notif.type as "info" | "warning" | "error" | "success",
      timestamp: notif.timestamp.toISOString(),
      read: notif.read,
    };
  }

  async deleteNotification(id: string): Promise<void> {
    const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    if (result.length === 0) {
      throw new Error("Notification not found");
    }
  }
}

export const dbStorage = new DbStorage();
