import type { Express } from "express";
import multer from "multer";
import { storage } from "./storage";
import { insertInventoryItemSchema, insertNotificationSchema } from "../shared/schema";
import { processVoiceInput } from "./voice";

const upload = multer({ storage: multer.memoryStorage() });

export function registerRoutes(app: Express) {
  // Inventory routes
  app.get("/api/inventory", async (_req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(req.params.id, validatedData);
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof Error && error.message === "Inventory item not found") {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      await storage.deleteInventoryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Inventory item not found") {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (_req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/:id", async (req, res) => {
    try {
      const notification = await storage.getNotification(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notification" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const newNotification = await storage.createNotification(validatedData);
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationRead(req.params.id);
      res.json(notification);
    } catch (error) {
      if (error instanceof Error && error.message === "Notification not found") {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      await storage.deleteNotification(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Notification not found") {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Voice processing route - transcribes audio, parses items, and saves to database
  app.post("/api/voice/process", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Transcribe and parse items from audio
      const { transcript, items } = await processVoiceInput(req.file.buffer);
      
      // Insert each parsed item into the database with validation
      const insertedItems = [];
      const failedItems = [];
      
      for (const item of items) {
        try {
          // Validate item against schema before insertion
          const validatedItem = insertInventoryItemSchema.parse(item);
          const inserted = await storage.createInventoryItem(validatedItem);
          insertedItems.push(inserted);
        } catch (itemError) {
          console.error("Failed to validate or insert item:", item, itemError);
          failedItems.push({ item, error: itemError instanceof Error ? itemError.message : "Unknown error" });
          // Continue with other items even if one fails
        }
      }

      res.json({
        transcript,
        items: insertedItems,
        count: insertedItems.length,
        failed: failedItems.length > 0 ? failedItems : undefined,
      });
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process voice input" 
      });
    }
  });
}
