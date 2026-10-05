import { getDb } from "../api/queries/connection";
import { shipments, shipmentEvents } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Demo shipment so customers can try live tracking immediately
  const existing = await db.query.shipments.findFirst({
    where: eq(shipments.trackingCode, "EXL-28471-TX"),
  });

  if (!existing) {
    const [{ id }] = await db
      .insert(shipments)
      .values({
        trackingCode: "EXL-28471-TX",
        customerName: "Demo Customer",
        origin: "Dallas, TX",
        destination: "Rotterdam, NL",
        mode: "Ocean freight",
        status: "in_transit",
        eta: "Oct 14",
      })
      .$returningId();

    await db.insert(shipmentEvents).values([
      {
        shipmentId: id,
        status: "pending",
        location: "Dallas, TX",
        note: "Shipment created and label issued",
      },
      {
        shipmentId: id,
        status: "picked_up",
        location: "Dallas, TX",
        note: "Container collected from shipper",
      },
      {
        shipmentId: id,
        status: "in_transit",
        location: "Port of Houston",
        note: "Loaded onto vessel, departed",
      },
    ]);
    console.log("Created demo shipment EXL-28471-TX");
  } else {
    console.log("Demo shipment already exists, skipping.");
  }

  console.log("Done.");
  process.exit(0); // close MySQL connection pool
}

seed();
