import { mysqlTable, varchar, text, json, int, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { SHIPMENT_STATUSES } from "@contracts/shipping";

export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  trackingCode: varchar("tracking_code", { length: 64 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  mode: varchar("mode", { length: 64 }).notNull(),
  eta: varchar("eta", { length: 64 }),
  goods: text("goods"),
  deliveryAddress: varchar("delivery_address", { length: 500 }),
  amount: varchar("amount", { length: 64 }),
  deliveryTime: varchar("delivery_time", { length: 64 }),
  status: mysqlEnum("status", SHIPMENT_STATUSES).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),

  // --- NEW FIELDS FOR DETAILED TRACKING ---
  modeOfTransport: varchar("mode_of_transport", { length: 255 }),
  departureAirport: varchar("departure_airport", { length: 255 }),
  destinationAirport: varchar("destination_airport", { length: 255 }),
  finalDeliveryAddress: text("final_delivery_address"),
  consigneeEori: varchar("consignee_eori", { length: 64 }),
  
  vehicles: json("vehicles").$type<{
    vehicle: string;
    vin: string;
    hsCode: string;
    origin: string;
  }[]>(),

  goldInvestment: text("gold_investment"),
  goldJewelry: text("gold_jewelry"),
  customsTariffNo: varchar("customs_tariff_no", { length: 64 }),
  exactWeight: varchar("exact_weight", { length: 64 }),
  declaredValue: varchar("declared_value", { length: 128 }),
  paymentStatus: varchar("payment_status", { length: 64 }),
});
