export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In a real app, we'd look up property/prospect, insert into DB.
    // For now, accept and return success and provide a Google Calendar event link.
    const when = `${body.date} ${body.time}`;

    let calendarUrl: string | undefined;
    try {
      const {
        propertyTitle,
        propertyAddress,
        prospectName,
        prospectEmail,
        date,
        time,
        notes,
      } = body || {};
      if (date && time && propertyTitle) {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + 45 * 60 * 1000);
        const fmt = (d: Date) =>
          `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(
            2,
            "0"
          )}${String(d.getUTCDate()).padStart(2, "0")}T${String(
            d.getUTCHours()
          ).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}00Z`;
        const dates = `${fmt(start)}/${fmt(end)}`;
        const text = encodeURIComponent(`Visit: ${propertyTitle}`);
        const details = encodeURIComponent(
          `${notes || ""}\nProspect: ${prospectName || ""} ${
            prospectEmail || ""
          }`
        );
        const location = encodeURIComponent(propertyAddress || "");
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${dates}&text=${text}&details=${details}&location=${location}`;
      }
    } catch {}

    return NextResponse.json({ ok: true, when, calendarUrl }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
