export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";
import { db } from "@/lib/db";
import { socialPost, socialSchedule, socialLog } from "@/lib/schema";
import { UploadPost } from "@/lib/upload-post";

type PublishBody = {
  text: string;
  mediaUrl?: string;
  platforms: Array<"facebook" | "instagram" | "linkedin" | "x" | "tiktok">;
  scheduledAt?: string; // ISO; if absent, publish immediately
  publishNow?: boolean;
  videoUrl?: string; // public URL to video file
  title?: string;
  managedUser?: string; // upload-post managed user handle
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async (_req, userId) => {
    try {
      const {
        text,
        mediaUrl,
        platforms,
        scheduledAt,
        publishNow,
        videoUrl,
        title,
        managedUser,
      } = (await req.json()) as PublishBody;
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

      type UploadResult = { platform: string; id?: string; error?: string };
      let uploadResults: UploadResult[] = [];
      const publicVideoUrl = videoUrl || mediaUrl;
      if (publishNow && publicVideoUrl && platforms.length > 0) {
        try {
          const apiKey = process.env.UPLOAD_POST_API_KEY;
          if (!apiKey) throw new Error("Missing UPLOAD_POST_API_KEY");
          const uploader = new UploadPost(apiKey);
          const result = await uploader.upload(publicVideoUrl, {
            title: title || text?.slice(0, 60) || "Video",
            user: managedUser || "default",
            platforms: ["tiktok"],
          });
          const maybeId = (result as { id?: string } | Record<string, unknown>)
            ?.id as string | undefined;
          uploadResults = [
            {
              platform: platforms[0],
              id: maybeId,
            },
          ];
        } catch (e) {
          uploadResults = [
            {
              platform: platforms[0],
              error: e instanceof Error ? e.message : "upload_failed",
            },
          ];
        }
      }

      const logs: (typeof socialLog.$inferInsert)[] = schedules.map((s) => ({
        scheduleId: s.id,
        level: "info" as const,
        message: s.status === "published" ? "Published" : "Scheduled",
      }));

      await db.insert(socialLog).values(logs);

      return NextResponse.json(
        { ok: true, postId: post.id, schedules, uploadResults },
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
