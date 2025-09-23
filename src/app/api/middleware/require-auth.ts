import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(req, userId);
}
