import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";
import { db } from "@/lib/db";
import { socialPost, socialSchedule, socialLog } from "@/lib/schema";
import { eq } from "drizzle-orm";

type PublishBody = {
  text: string;
  mediaUrl?: string;
  platforms: Array<"facebook" | "instagram" | "linkedin" | "x" | "tiktok">;
  scheduledAt?: string; // ISO; if absent, publish immediately
  publishNow?: boolean;
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async (_req, userId) => {
    try {
      const { text, mediaUrl, platforms, scheduledAt, publishNow } =
        (await req.json()) as PublishBody;
      if (!text || !Array.isArray(platforms) || platforms.length === 0) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const [post] = await db
        .insert(socialPost)
        .values({ userId, contentText: text, mediaUrl: mediaUrl || null })
        .returning();

      const schedules = await Promise.all(
        platforms.map(async (p) => {
          const [row] = await db
            .insert(socialSchedule)
            .values({
              userId,
              postId: post.id,
              platform: p,
              scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
              status: scheduledAt || !publishNow ? "scheduled" : "published",
            })
            .returning();
          return row;
        })
      );

      // Log results (stub immediate publish)
      await db.insert(socialLog).values(
        schedules.map((s) => ({
          scheduleId: s.id,
          level: "info",
          message: s.status === "published" ? "Published (stub)" : "Scheduled",
        }))
      );

      return NextResponse.json(
        { ok: true, postId: post.id, schedules },
        { status: 201 }
      );
    } catch (e) {
      console.error("/api/social/publish error", e);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
