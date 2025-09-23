import { NextRequest, NextResponse } from "next/server";
import { enhancePropertyImage } from "@/lib/google-ai";
import { requireAuth } from "@/app/api/middleware/require-auth";

export async function POST(request: NextRequest) {
  return requireAuth(request, async (request) => {
    try {
      const body = await request.json();
      const {
        imageData,
        mimeType,
        enhancementType = "professional",
        roomType,
        designTheme,
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

      const result = await enhancePropertyImage({
        imageData,
        mimeType,
        enhancementType,
        roomType,
        designTheme,
        variantSeed,
        intensity,
        quality,
      });

      if (!result.success) {
        // Determine appropriate HTTP status based on error type
        let status = 500;
        if (
          result.errorType === "quota_exceeded" ||
          result.errorType === "rate_limit"
        ) {
          status = 429; // Too Many Requests
        }

        return NextResponse.json(
          {
            error: result.error || "Failed to enhance image",
            errorType: result.errorType || "unknown",
            retryAfter: result.retryAfter,
            quotaZero: result.quotaZero,
          },
          { status }
        );
      }

      return NextResponse.json({
        success: true,
        enhancedImageData: result.enhancedImageData,
        mimeType: result.mimeType,
      });
    } catch (error) {
      console.error("Error in enhance-image API:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
