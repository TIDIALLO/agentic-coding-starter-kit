import { GoogleGenAI } from "@google/genai";
import mime from "mime";

export type RoomType =
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining_room"
  | "office"
  | "outdoor"
  | "other";

export type DesignTheme =
  | "modern"
  | "minimalist"
  | "industrial"
  | "scandinavian"
  | "traditional"
  | "bohemian"
  | "rustic"
  | "coastal"
  | "vintage"
  | "luxury";

export interface ImageEnhancementRequest {
  imageData: string; // base64 encoded image
  mimeType: string;
  // Enhancement mode (legacy enhancement)
  enhancementType?: "professional" | "brightness" | "contrast" | "color";
  // Redesign mode (staging)
  roomType?: RoomType;
  designTheme?: DesignTheme;
  // Additional user-provided creative brief for redesign mode
  customPrompt?: string;
  // Variation & strength controls
  variantSeed?: number;
  intensity?: "subtle" | "balanced" | "bold";
  // Quality profile to control model and output clarity
  quality?: "fast" | "balanced" | "hq" | "ultra";
}

export interface ImageEnhancementResult {
  enhancedImageData: string; // base64 encoded enhanced image
  mimeType: string;
  success: boolean;
  error?: string;
  errorType?: "quota_exceeded" | "rate_limit" | "api_error" | "unknown";
  retryAfter?: number;
  quotaZero?: boolean;
}

export async function enhancePropertyImage(
  request: ImageEnhancementRequest
): Promise<ImageEnhancementResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        enhancedImageData: "",
        mimeType: request.mimeType,
        success: false,
        error:
          "GEMINI_API_KEY is not set. Add it to your .env file and restart the server.",
        errorType: "api_error",
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const config = {
      // Request both image (primary) and text (fallback/status) modalities
      responseModalities: ["IMAGE", "TEXT"] as string[],
    };

    // Model selection: prefer ultra-clear preview model for ultra quality
    const ultraModel =
      process.env.GEMINI_IMAGE_MODEL_ULTRA || "gemini-2.5-flash-image-preview";
    const defaultModel =
      process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-exp";
    const model = request.quality === "ultra" ? ultraModel : defaultModel;

    const enhancementPrompts = {
      professional:
        "Enhance this property image to make it look more professional for real estate marketing. Improve lighting, colors, and overall appeal while keeping it realistic.",
      brightness:
        "Improve the brightness and lighting of this property image to make it more appealing.",
      contrast: "Enhance the contrast and clarity of this property image.",
      color:
        "Improve the color balance and saturation of this property image to make it more vibrant and appealing.",
    } as const;

    const roomTypeLabelMap: Record<RoomType, string> = {
      living_room: "living room",
      bedroom: "bedroom",
      kitchen: "kitchen",
      bathroom: "bathroom",
      dining_room: "dining room",
      office: "home office",
      outdoor: "outdoor space",
      other: "room",
    };

    // Build prompt based on redesign vs enhancement
    const isRedesign = Boolean(request.designTheme);
    const intensityTextMap: Record<
      NonNullable<ImageEnhancementRequest["intensity"]>,
      string
    > = {
      subtle:
        "Apply subtle styling and lighting improvements while keeping layout and most furniture recognizable.",
      balanced:
        "Apply a clear restyle with updated furniture and lighting while preserving realism and spatial layout.",
      bold: "Strong restyle with distinct furniture and decor while preserving architecture and camera; do not change walls/windows or geometry.",
    };

    const textPrompt = isRedesign
      ? `You are an expert interior CGI renderer for real-estate listings.
Redesign this ${roomTypeLabelMap[request.roomType || "other"]} in a ${
          request.designTheme
        } style.

Strict constraints:
- Preserve architectural structure (walls, windows, doors, ceiling height, flooring pattern if visible).
- Keep camera angle, perspective and geometry consistent with the original.

Creative direction (${request.intensity || "balanced"}): ${
          intensityTextMap[request.intensity || "balanced"]
        }
Use bright, clean lighting (soft global illumination), low noise, realistic materials.
Stage cohesive furniture/decor/colors consistent with ${
          request.designTheme
        }. Remove clutter and artifacts.
Variation seed: ${String(
          request.variantSeed ?? "auto"
        )} (produce a distinct variation).
Avoid text overlays, watermarks or borders.
Output a high-resolution photo. Match or exceed the input resolution without adding borders.
${request.customPrompt ? `\nUser creative brief: ${request.customPrompt}` : ""}`
      : enhancementPrompts[
          (request.enhancementType ||
            "professional") as keyof typeof enhancementPrompts
        ];

    const contents = [
      {
        role: "user" as const,
        parts: [
          {
            text: textPrompt,
          },
          {
            inlineData: {
              mimeType: request.mimeType,
              data: request.imageData,
            },
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let enhancedImageData = "";
    let resultMimeType = "";

    for await (const chunk of response) {
      if (
        !chunk.candidates ||
        !chunk.candidates[0].content ||
        !chunk.candidates[0].content.parts
      ) {
        continue;
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        enhancedImageData = inlineData.data || "";
        resultMimeType = inlineData.mimeType || request.mimeType;
        break; // We only need the first enhanced image
      }
    }

    if (!enhancedImageData) {
      return {
        enhancedImageData: "",
        mimeType: request.mimeType,
        success: false,
        error: "No enhanced image was generated",
      };
    }

    return {
      enhancedImageData,
      mimeType: resultMimeType,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error enhancing image:", error);

    // Handle specific Google API errors
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      const errorMessage = error.message.toLowerCase();

      // Extract retry delay and detect zero-quota from the provider payload (message contains a JSON blob)
      const messageText = (error as { message?: string }).message || "";
      const retrySecondsFromMessage = (() => {
        const m = messageText.match(/\"retryDelay\"\s*:\s*\"(\d+)s\"/);
        if (m && m[1]) return parseInt(m[1], 10);
        const m2 = messageText.match(/Please retry in\s+([\d.]+)s/);
        if (m2 && m2[1]) return Math.ceil(parseFloat(m2[1]));
        return undefined;
      })();
      const isQuotaZero = /limit:\s*0/.test(messageText);

      // Check for quota exceeded errors
      if (
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("429")
      ) {
        return {
          enhancedImageData: "",
          mimeType: request.mimeType,
          success: false,
          error:
            "Google AI quota exceeded. Please try again in a few minutes or upgrade your plan.",
          errorType: "quota_exceeded",
          retryAfter: retrySecondsFromMessage ?? 60,
          quotaZero: isQuotaZero,
        };
      }

      // Check for rate limiting
      if (errorMessage.includes("too many requests")) {
        return {
          enhancedImageData: "",
          mimeType: request.mimeType,
          success: false,
          error: "Too many requests. Please wait a moment before trying again.",
          errorType: "rate_limit",
          retryAfter: retrySecondsFromMessage ?? 30,
        };
      }
    }

    // Handle HTTP response errors
    if (
      error &&
      typeof error === "object" &&
      (("status" in error && error.status === 429) ||
        ("code" in error && error.code === 429))
    ) {
      return {
        enhancedImageData: "",
        mimeType: request.mimeType,
        success: false,
        error:
          "Google AI service is temporarily unavailable due to quota limits. Please try again later.",
        errorType: "quota_exceeded",
        retryAfter: 120,
      };
    }

    // Generic API error
    return {
      enhancedImageData: "",
      mimeType: request.mimeType,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while enhancing image",
      errorType: "api_error",
    };
  }
}

export function getMimeTypeFromFile(filename: string): string {
  return mime.getType(filename) || "application/octet-stream";
}

export function getFileExtensionFromMimeType(mimeType: string): string {
  return mime.getExtension(mimeType) || "";
}
