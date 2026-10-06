import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---------- Quote requests (public form submissions) ----------
export const quotes = mysqlTable("quotes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  origin: varchar("origin", { length: 255 }),
  destination: varchar("destination", { length: 255 }),
  mode: varchar("mode", { length: 64 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["new", "quoted", "closed"])
    .default("new")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

// ---------- Shipments (trackable freight) ----------
export const shipments = mysqlTable("shipments", {
  id: serial("id").primaryKey(),
  trackingCode: varchar("trackingCode", { length: 64 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  mode: varchar("mode", { length: 64 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
  ])
    .default("pending")
    .notNull(),
  goods: text("goods"),
deliveryAddress: varchar("deliveryAddress", { length: 500 }),
amount: varchar("amount", { length: 64 }),
deliveryTime: varchar("deliveryTime", { length: 64 }),
  eta: varchar("eta", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

// ---------- Shipment tracking events (timeline) ----------
export const shipmentEvents = mysqlTable("shipment_events", {
  id: serial("id").primaryKey(),
  shipmentId: bigint("shipmentId", { mode: "number", unsigned: true }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  location: varchar("location", { length: 255 }),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
export type InsertShipmentEvent = typeof shipmentEvents.$inferInsert;
