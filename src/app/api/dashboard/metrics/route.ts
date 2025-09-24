export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contract } from "@/lib/schema";
import { and, eq, gte } from "drizzle-orm";

function monthStart(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  return d;
}

function addMonths(date: Date, delta: number): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1)
  );
  return d;
}

export async function GET() {
  try {
    const now = new Date();
    const startOfThisMonth = monthStart(now);
    const startOfSixMonthsAgo = addMonths(startOfThisMonth, -5); // include this month => 6 points total

    // Get signed contracts in the last 6 months
    const recentContracts = await db
      .select({
        price: contract.price,
        createdAt: contract.createdAt,
        type: contract.type,
        status: contract.status,
      })
      .from(contract)
      .where(
        and(
          eq(contract.status, "signed"),
          gte(contract.createdAt, startOfSixMonthsAgo)
        )
      );

    // Helper to parse decimal -> number
    const toNumber = (v: unknown): number => {
      if (typeof v === "number") return Number.isFinite(v) ? v : 0;
      if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };

    // Totals this month
    let totalIncomeMonth = 0;
    recentContracts.forEach((c) => {
      const created = new Date(c.createdAt as unknown as string);
      if (
        created.getUTCFullYear() === startOfThisMonth.getUTCFullYear() &&
        created.getUTCMonth() === startOfThisMonth.getUTCMonth()
      ) {
        totalIncomeMonth += toNumber(c.price);
      }
    });

    // Placeholder expenses (no explicit expenses table). Keep 0 for now.
    const totalExpensesMonth = 0;
    const netBalance = totalIncomeMonth - totalExpensesMonth;

    // Revenue trend by month for last 6 months (including current)
    const labels: string[] = [];
    const monthKey = (d: Date) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    for (let i = -5; i <= 0; i++) {
      const d = addMonths(startOfThisMonth, i);
      labels.push(monthKey(d));
    }
    const trendMap = new Map(labels.map((l) => [l, 0] as [string, number]));
    recentContracts.forEach((c) => {
      const k = monthKey(new Date(c.createdAt as unknown as string));
      if (trendMap.has(k))
        trendMap.set(k, (trendMap.get(k) || 0) + toNumber(c.price));
    });
    const revenueTrend = labels.map((l, idx) => ({
      label: l,
      value: trendMap.get(l) || 0,
      index: idx,
    }));

    // Revenue by contract type
    const byTypeMap = new Map<string, number>();
    recentContracts.forEach((c) => {
      const key = String(c.type);
      byTypeMap.set(key, (byTypeMap.get(key) || 0) + toNumber(c.price));
    });
    const revenueByType = Array.from(byTypeMap.entries()).map(
      ([label, value]) => ({ label, value })
    );

    return NextResponse.json({
      totalIncomeMonth,
      totalExpensesMonth,
      netBalance,
      revenueTrend,
      revenueByType,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "failed_to_compute_metrics" },
      { status: 500 }
    );
  }
}
