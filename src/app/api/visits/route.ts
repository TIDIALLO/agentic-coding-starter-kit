import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In a real app, we'd look up property/prospect, insert into DB.
    // For now, accept and return success with echo body.
    const when = `${body.date} ${body.time}`;
    return NextResponse.json({ ok: true, when }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


