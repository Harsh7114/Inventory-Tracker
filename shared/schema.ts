import { z } from "zod";

export const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  category: z.string(),
  location: z.string(),
  reorderThreshold: z.number(),
  lastUpdated: z.string(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const insertInventoryItemSchema = inventoryItemSchema.omit({ id: true, lastUpdated: true });
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  message: z.string(),
  type: z.enum(["info", "warning", "error", "success"]),
  timestamp: z.string(),
  read: z.boolean(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const insertNotificationSchema = notificationSchema.omit({ id: true, timestamp: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
