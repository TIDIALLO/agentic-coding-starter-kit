import { NextRequest, NextResponse } from "next/server";
import { withCredit } from "@/app/api/middleware/with-credit";
import { requireAuth } from "@/app/api/middleware/require-auth";
import { enhancePropertyImage, DesignTheme, RoomType } from "@/lib/google-ai";

type RedesignRequestBody = {
  imageData: string;
  mimeType: string;
  roomType?: RoomType;
  themes: DesignTheme[];
  variantSeed?: number;
  intensity?: "subtle" | "balanced" | "bold";
  quality?: "fast" | "balanced" | "hq" | "ultra";
};

export async function POST(request: NextRequest) {
  return requireAuth(request, async (requestAuthed: NextRequest) =>
    withCredit(requestAuthed, async (request: NextRequest) => {
      try {
        const body = (await request.json()) as RedesignRequestBody;
        const {
          imageData,
          mimeType,
          roomType,
          themes,
          variantSeed,
          intensity,
          quality,
        } = body;

        if (!imageData || !mimeType) {
          return NextResponse.json(
            { error: "Missing required fields: imageData and mimeType" },
            { status: 400 }
          );
        }
        if (!Array.isArray(themes) || themes.length === 0) {
          return NextResponse.json(
            { error: "Provide 1-4 design themes" },
            { status: 400 }
          );
        }

        const limitedThemes = themes.slice(0, 4);

        // Minimal concurrency limit (2) to reduce provider rate-limits
        const results: Array<
          | {
              theme: DesignTheme;
              success: true;
              enhancedImageData: string;
              mimeType: string;
            }
          | {
              theme: DesignTheme;
              success: false;
              error: string;
              errorType?:
                | "quota_exceeded"
                | "rate_limit"
                | "api_error"
                | "unknown";
              retryAfter?: number;
              quotaZero?: boolean;
            }
        > = [];

        const queue = [...limitedThemes];
        const attempts = new Map<DesignTheme, number>();
        const workers: Promise<void>[] = [];
        const maxConcurrent = 1; // be gentle with provider rate limits

        const sleep = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        const runWorker = async () => {
          while (queue.length > 0) {
            const theme = queue.shift() as DesignTheme;
            const seed =
              (variantSeed ?? Math.floor(Math.random() * 1e6)) + results.length;
            const r = await enhancePropertyImage({
              imageData,
              mimeType,
              roomType,
              designTheme: theme,
              variantSeed: seed,
              intensity: intensity ?? "balanced",
              quality,
            });
            if (r.success) {
              results.push({
                theme,
                success: true,
                enhancedImageData: r.enhancedImageData,
                mimeType: r.mimeType,
              });
            } else {
              // Retry once if rate-limited or temporary quota and we have a retryAfter
              const prev = attempts.get(theme) ?? 0;
              const canRetry =
                (r.errorType === "rate_limit" ||
                  (r.errorType === "quota_exceeded" && !r.quotaZero)) &&
                typeof r.retryAfter === "number" &&
                prev < 1;

              if (canRetry) {
                attempts.set(theme, prev + 1);
                await sleep((r.retryAfter as number) * 1000);
                queue.push(theme);
                continue;
              }

              results.push({
                theme,
                success: false,
                error: r.error || "Failed to redesign image",
                errorType: r.errorType,
                retryAfter: r.retryAfter,
                quotaZero: r.quotaZero,
              });

              // If project has zero free quota, stop wasting calls and mark remaining as same error
              if (r.errorType === "quota_exceeded" && r.quotaZero) {
                while (queue.length > 0) {
                  const remaining = queue.shift() as DesignTheme;
                  results.push({
                    theme: remaining,
                    success: false,
                    error: r.error || "Quota exhausted",
                    errorType: r.errorType,
                    retryAfter: r.retryAfter,
                    quotaZero: r.quotaZero,
                  });
                }
                break;
              }

              // Respect retry hints on rate limits before proceeding
              if (r.errorType === "rate_limit" && r.retryAfter) {
                await sleep(r.retryAfter * 1000);
              }
            }
          }
        };

        for (
          let i = 0;
          i < Math.min(maxConcurrent, limitedThemes.length);
          i += 1
        ) {
          workers.push(runWorker());
        }
        await Promise.all(workers);

        const anySuccess = results.some((r) => r.success);
        const quotaIssue = results.find(
          (r) =>
            !r.success &&
            (r.errorType === "quota_exceeded" || r.errorType === "rate_limit")
        ) as any;

        // Always return 200 with structured info so the client can render fallback/UX
        const status = 200;

        return NextResponse.json(
          {
            success: anySuccess,
            results,
            errorType: quotaIssue?.errorType,
            retryAfter: quotaIssue?.retryAfter,
            quotaZero: quotaIssue?.quotaZero,
          },
          { status }
        );
      } catch (error) {
        console.error("Error in redesign-room API:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    })
  );
}
