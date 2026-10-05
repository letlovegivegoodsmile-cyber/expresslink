import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { quotesRouter, trackingRouter, shipmentsRouter } from "./shippingRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  quotes: quotesRouter,
  tracking: trackingRouter,
  shipments: shipmentsRouter,
});

export type AppRouter = typeof appRouter;
