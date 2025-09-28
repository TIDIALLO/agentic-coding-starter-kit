export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/middleware/require-auth";

type UploadBody = {
  dataUrl: string; // data:image/jpeg;base64,...
  fileName?: string;
};

export async function POST(req: NextRequest) {
  return requireAuth(req, async () => {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return NextResponse.json(
          { error: "BLOB_READ_WRITE_TOKEN not set" },
          { status: 500 }
        );
      }
      const { dataUrl, fileName } = (await req.json()) as UploadBody;
      if (!dataUrl || !dataUrl.startsWith("data:")) {
        return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });
      }
      const [meta, b64] = dataUrl.split(",");
      const contentType = /data:(.*?);base64/.exec(meta)?.[1] || "image/jpeg";
      const bytes = Buffer.from(b64, "base64");
      const name =
        fileName ||
        `image-${Date.now()}.${contentType.includes("png") ? "png" : "jpg"}`;

      const res = await fetch("https://api.vercel.com/v2/blob", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": contentType,
          "x-vercel-filename": name,
        },
        body: bytes,
      });
      if (!res.ok) {
        const txt = await res.text();
        return NextResponse.json(
          { error: `Blob upload failed: ${res.status} ${txt}` },
          { status: 500 }
        );
      }
      const json = (await res.json()) as { url?: string };
      if (!json?.url) {
        return NextResponse.json(
          { error: "Blob upload returned no URL" },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, url: json.url });
    } catch (e) {
      console.error("/api/upload-image error", e);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
