export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";
import { db } from "@/lib/db";
import { payment } from "@/lib/schema";

type ChargeBody = {
  amount: number;
  currency?: string;
  description?: string;
  creditsToGrant?: number;
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async (_req, userId) => {
    try {
      const secretKey = process.env.BICTORYS_SECRET_KEY;
      const apiBase =
        process.env.BICTORYS_API_BASE || "https://api.test.bictorys.com";
      if (!secretKey) {
        return NextResponse.json(
          { error: "Missing BICTORYS_SECRET_KEY" },
          { status: 500 }
        );
      }

      const {
        amount,
        currency = "XOF",
        description = "Credits purchase",
        creditsToGrant = 20,
      } = (await req.json()) as ChargeBody;
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      const headers: Record<string, string> = {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${secretKey}`,
      };

      const providerUrl = `${apiBase}/pay/v1/charges?payment_type=card`;
      const payload: {
        amount: number;
        currency: string;
        description: string;
        metadata: { userId: string; creditsToGrant: number };
      } = {
        amount,
        currency,
        description,
        metadata: {
          userId,
          creditsToGrant,
        },
      };

      const res = await fetch(providerUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: json?.message || "Payment create failed" },
          { status: 502 }
        );
      }

      const created = await db
        .insert(payment)
        .values({
          userId,
          amount,
          currency,
          description,
          externalId: json?.data?.id || json?.id || null,
          status: "created",
        })
        .returning();

      return NextResponse.json({
        ok: true,
        payment: created[0],
        provider: json,
        creditsToGrant,
      });
    } catch (e) {
      console.error("/api/payments/charge error", e);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
