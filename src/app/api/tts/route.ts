import { NextRequest, NextResponse } from "next/server";

// Simple TTS proxy to OpenAI for generating French voice audio
// Expects JSON: { text: string, voice?: string, format?: "mp3" | "wav" | "ogg" }
export async function POST(request: NextRequest) {
  try {
    const { text, voice = "alloy", format = "mp3" } = await request.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not set" },
        { status: 500 }
      );
    }

    // Prefer modern TTS model name if available, fallback to tts-1
    const model = process.env.OPENAI_TTS_MODEL || "tts-1";
    const resp = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        format,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: "TTS failed", details: errText },
        { status: 502 }
      );
    }

    const arrayBuf = await resp.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");
    const mime =
      format === "wav"
        ? "audio/wav"
        : format === "ogg"
        ? "audio/ogg"
        : "audio/mpeg";
    return NextResponse.json({
      success: true,
      audioBase64: base64,
      mimeType: mime,
    });
  } catch (e) {
    console.error("TTS route error", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
