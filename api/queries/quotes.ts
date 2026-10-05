import { getDb } from "./connection";
import { quotes } from "@db/schema";
import { desc, eq } from "drizzle-orm";
import type { InsertQuote, Quote } from "@db/schema";

export async function createQuote(
  data: Omit<InsertQuote, "id" | "createdAt" | "status">,
): Promise<Quote> {
  const [{ id }] = await getDb().insert(quotes).values(data).$returningId();
  const row = await getDb().query.quotes.findFirst({ where: eq(quotes.id, id) });
  if (!row) throw new Error("Quote insert failed");
  return row;
}

export async function listQuotes(): Promise<Quote[]> {
  return getDb().select().from(quotes).orderBy(desc(quotes.createdAt));
}

export async function setQuoteStatus(
  id: number,
  status: "new" | "quoted" | "closed",
): Promise<void> {
  await getDb().update(quotes).set({ status }).where(eq(quotes.id, id));
}
