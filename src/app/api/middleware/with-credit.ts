import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function withCredit(
  req: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  // Use Better Auth session
  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({ id: userTable.id, credits: userTable.credits })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  const u = rows[0];
  if (!u)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if ((u.credits ?? 0) <= 0) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }

  // Debit 1 credit atomically
  await db.execute(
    sql`update "user" set credits = credits - 1 where id = ${userId} and credits > 0`
  );

  return handler(req, userId);
}
