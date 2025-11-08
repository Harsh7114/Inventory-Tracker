import { db } from "./index";
import { inventoryItems, notifications } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(notifications);
  await db.delete(inventoryItems);

  // Seed inventory items
  const items = await db.insert(inventoryItems).values([
    {
      name: "Laptop",
      quantity: 10,
      category: "Electronics",
      location: "Warehouse A",
      reorderThreshold: 5,
    },
    {
      name: "Office Chair",
      quantity: 25,
      category: "Furniture",
      location: "Warehouse B",
      reorderThreshold: 10,
    },
    {
      name: "Printer",
      quantity: 5,
      category: "Electronics",
      location: "Warehouse A",
      reorderThreshold: 3,
    },
    {
      name: "Toned Milk",
      quantity: 25,
      category: "Dairy",
      location: "Fridge",
      reorderThreshold: 10,
    },
    {
      name: "Tomatoes",
      quantity: 15,
      category: "Vegetables",
      location: "Counter",
      reorderThreshold: 8,
    },
    {
      name: "Onions",
      quantity: 4,
      category: "Vegetables",
      location: "Pantry",
      reorderThreshold: 6,
    },
    {
      name: "Basmati Rice",
      quantity: 45,
      category: "Grains",
      location: "Pantry",
      reorderThreshold: 20,
    },
  ]).returning();

  console.log(`✅ Seeded ${items.length} inventory items`);

  // Seed notifications
  const notifs = await db.insert(notifications).values([
    {
      message: "Low stock alert: Printer quantity is below threshold",
      type: "warning",
      read: false,
    },
    {
      message: "Low stock alert: Onions quantity is below threshold",
      type: "warning",
      read: false,
    },
  ]).returning();

  console.log(`✅ Seeded ${notifs.length} notifications`);
  console.log("🎉 Database seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
