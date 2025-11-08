import { pgTable, varchar, integer, timestamp, boolean, text, uuid } from "drizzle-orm/pg-core";

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  reorderThreshold: integer("reorder_threshold").notNull().default(5),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
