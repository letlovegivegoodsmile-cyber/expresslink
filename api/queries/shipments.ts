import { getDb } from "./connection";
import { shipmentEvents, shipments } from "@db/schema";
import { asc, desc, eq } from "drizzle-orm";
import type { Shipment, ShipmentEvent } from "@db/schema";

export type ShipmentWithEvents = Shipment & { events: ShipmentEvent[] };

export async function findShipmentByCode(
  code: string,
): Promise<ShipmentWithEvents | undefined> {
  const db = getDb();
  const shipment = await db.query.shipments.findFirst({
    where: eq(shipments.trackingCode, code.toUpperCase()),
  });
  if (!shipment) return undefined;
  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.shipmentId, shipment.id))
    .orderBy(asc(shipmentEvents.createdAt));
  return { ...shipment, events };
}

export async function listShipments(): Promise<Shipment[]> {
  return getDb().select().from(shipments).orderBy(desc(shipments.createdAt));
}

export async function createShipment(data: {
  trackingCode: string;
  customerName?: string;
  origin: string;
  destination: string;
  mode: string;
  eta?: string;
    goods?: string;
  deliveryAddress?: string;
  amount?: string;
  deliveryTime?: string;
}): Promise<ShipmentWithEvents> {
  const db = getDb();
  const [{ id }] = await db
    .insert(shipments)
    .values({ ...data, trackingCode: data.trackingCode.toUpperCase() })
    .$returningId();
  await db.insert(shipmentEvents).values({
    shipmentId: id,
    status: "pending",
    location: data.origin,
    note: "Shipment created and label issued",
  });
  const created = await findShipmentByCode(data.trackingCode);
  if (!created) throw new Error("Shipment insert failed");
  return created;
}

export async function updateShipmentStatus(
  id: number,
  status: Shipment["status"],
  location?: string,
  note?: string,
): Promise<ShipmentWithEvents | undefined> {
  const db = getDb();
  await db.update(shipments).set({ status }).where(eq(shipments.id, id));
  const shipment = await db.query.shipments.findFirst({
    where: eq(shipments.id, id),
  });
  if (!shipment) return undefined;
  await db.insert(shipmentEvents).values({
    shipmentId: id,
    status,
    location: location ?? null,
    note: note ?? null,
  });
  return findShipmentByCode(shipment.trackingCode);
}

export async function deleteShipment(id: number): Promise<void> {
  const db = getDb();
  await db.delete(shipmentEvents).where(eq(shipmentEvents.shipmentId, id));
  await db.delete(shipments).where(eq(shipments.id, id));
}
