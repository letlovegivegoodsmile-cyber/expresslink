import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { createQuote, listQuotes, setQuoteStatus } from "./queries/quotes";
import {
  createShipment,
  deleteShipment,
  findShipmentByCode,
  listShipments,
  updateShipmentStatus,
} from "./queries/shipments";
import { SHIPMENT_STATUSES, FREIGHT_MODES } from "@contracts/shipping";

export const quotesRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().trim().min(2, "Please enter your name").max(255),
        email: z.string().trim().email("Please enter a valid email").max(320),
        origin: z.string().trim().max(255).optional(),
        destination: z.string().trim().max(255).optional(),
        mode: z.enum(FREIGHT_MODES),
        message: z.string().trim().max(5000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const quote = await createQuote({
        name: input.name,
        email: input.email,
        origin: input.origin || null,
        destination: input.destination || null,
        mode: input.mode,
        message: input.message || null,
      });
      return { ok: true, id: quote.id };
    }),

  list: adminQuery.query(() => listQuotes()),

  setStatus: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["new", "quoted", "closed"]),
      }),
    )
    .mutation(async ({ input }) => {
      await setQuoteStatus(input.id, input.status);
      return { ok: true };
    }),
});

export const trackingRouter = createRouter({
  lookup: publicQuery
    .input(z.object({ code: z.string().trim().min(3).max(64) }))
    .query(async ({ input }) => {
      const shipment = await findShipmentByCode(input.code);
      if (!shipment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No shipment found for that tracking number.",
        });
      }
      return shipment;
    }),
});

function generateTrackingCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `EXL-${num}-TX`;
}

export const shipmentsRouter = createRouter({
  list: adminQuery.query(() => listShipments()),

  create: adminQuery
    .input(
      z.object({
        customerName: z.string().trim().max(255).optional(),
        origin: z.string().trim().min(2).max(255),
        destination: z.string().trim().min(2).max(255),
        mode: z.string().trim().min(2).max(64),
        eta: z.string().trim().max(64).optional(),
                goods: z.string().trim().max(5000).optional(),
        deliveryAddress: z.string().trim().max(500).optional(),
        amount: z.string().trim().max(64).optional(),
        deliveryTime: z.string().trim().max(64).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let code = generateTrackingCode();
      // ensure uniqueness
      for (let i = 0; i < 5; i++) {
        const existing = await findShipmentByCode(code);
        if (!existing) break;
        code = generateTrackingCode();
      }
      const shipment = await createShipment({ ...input, trackingCode: code });
      return shipment;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(SHIPMENT_STATUSES),
        location: z.string().trim().max(255).optional(),
        note: z.string().trim().max(500).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updated = await updateShipmentStatus(
        input.id,
        input.status,
        input.location,
        input.note,
      );
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shipment not found." });
      }
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteShipment(input.id);
      return { ok: true };
    }),
});
