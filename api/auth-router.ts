import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { env } from "./lib/env";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { upsertUser } from "./queries/users";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  login: publicQuery
    .input(z.object({ password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expected = process.env.ADMIN_PASSWORD ?? "";
      if (!expected || input.password !== expected) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong password" });
      }
      const unionId = "local-admin";
      await upsertUser({
        unionId,
        name: "Admin",
        role: "admin",
        lastSignInAt: new Date(),
      });
      const token = await signSessionToken({ unionId, clientId: env.appId });
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true };
    }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
