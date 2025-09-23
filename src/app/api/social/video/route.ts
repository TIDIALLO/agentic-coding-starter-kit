import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";

type VideoBody = {
  images: string[]; // data URLs or URLs (data URLs preferred)
  prefer4K?: boolean;
  secondsPerSlide?: number;
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async () => {
    try {
      const {
        images,
        prefer4K = false,
        secondsPerSlide = 2.2,
      } = (await req.json()) as VideoBody;
      if (!Array.isArray(images) || images.length === 0) {
        return NextResponse.json({ error: "No images" }, { status: 400 });
      }
      // For now, do client-side generation in Social Studio; server could be used later with headless canvas/ffmpeg.
      return NextResponse.json({
        ok: true,
        hint: "Generate on client for now",
        prefer4K,
        secondsPerSlide,
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
