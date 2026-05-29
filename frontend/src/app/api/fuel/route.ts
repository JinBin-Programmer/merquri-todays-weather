import { NextResponse } from "next/server";

const FUEL_URL =
  "https://api.data.gov.my/data-catalogue?id=fuelprice&limit=1&sort=-date&include=date,ron95,ron97,diesel,diesel_eastmsia";

export async function GET() {
  try {
    const res = await fetch(FUEL_URL, { next: { revalidate: 86400 } }); // cache 24h — prices update weekly
    if (!res.ok) return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });

    const raw: { date: string; ron95: number; ron97: number; diesel: number; diesel_eastmsia: number }[] =
      await res.json();

    const latest = raw[0];
    if (!latest) return NextResponse.json({ error: "No data" }, { status: 502 });

    return NextResponse.json({
      date: latest.date,
      ron95: latest.ron95,
      ron97: latest.ron97,
      diesel: latest.diesel,
      dieselEastMsia: latest.diesel_eastmsia,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
