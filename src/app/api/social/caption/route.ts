export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";
import { GoogleGenAI } from "@google/genai";

type CaptionBody = {
  locale?: "en" | "fr";
  context?: string; // optional context about the property/post
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async () => {
    try {
      const { locale = "en", context = "" } = (await req.json()) as CaptionBody;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY not set" },
          { status: 500 }
        );
      }
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env.OPENAI_TEXT_MODEL || "gemini-2.0-flash-exp";
      const prompt =
        locale === "fr"
          ? `Écris une légende courte et percutante en français pour un post immobilier. Garde un ton professionnel et moderne, ajoute 2-3 hashtags pertinents. Contexte: ${context}`
          : `Write a short, punchy caption in English for a real-estate post. Keep it professional and modern, add 2-3 relevant hashtags. Context: ${context}`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const text = response.text?.trim() || "";
      return NextResponse.json({ ok: true, caption: text });
    } catch (e) {
      console.error("/api/social/caption error", e);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
