import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payment, credits, user as userTable } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.BICTORYS_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing BICTORYS_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    const signature = req.headers.get("x-bictorys-signature") || "";
    // NOTE: Implement real signature verification with secret if provider supports it
    if (!signature) {
      // For now, accept but log missing signature
      console.warn("Missing Bictorys signature header");
    }

    const body = await req.json();
    // Expecting a structure like { id, status, amount, currency, metadata: { userId, creditsToGrant }, ... }
    const externalId: string | undefined = body?.id || body?.data?.id;
    const status: string | undefined = body?.status || body?.data?.status;
    const userId: string | undefined =
      body?.metadata?.userId || body?.data?.metadata?.userId;
    const creditsToGrant: number = Number(
      body?.metadata?.creditsToGrant ||
        body?.data?.metadata?.creditsToGrant ||
        0
    );

    if (!externalId) {
      return NextResponse.json(
        { error: "Missing external payment id" },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(payment)
      .where(eq(payment.externalId, externalId))
      .limit(1);
    const existing = rows[0];
    if (!existing) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (status === "succeeded" || status === "success") {
      await db
        .update(payment)
        .set({ status: "succeeded" })
        .where(eq(payment.id, existing.id));
      if (userId && creditsToGrant > 0) {
        await db.execute(
          sql`update "user" set credits = credits + ${creditsToGrant} where id = ${userId}`
        );
        await db
          .insert(credits)
          .values({ userId, amount: creditsToGrant, reason: "payment" });
      }
    } else if (status === "failed") {
      await db
        .update(payment)
        .set({ status: "failed" })
        .where(eq(payment.id, existing.id));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/payments/webhook error", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
