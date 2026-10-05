// Shared shipping domain constants (frontend + backend)

export const SHIPMENT_STATUSES = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export const FREIGHT_MODES = [
  "Air freight",
  "Ocean freight",
  "Ground transport",
  "Warehousing & distribution",
  "Not sure — advise me",
] as const;
