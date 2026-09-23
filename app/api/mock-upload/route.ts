import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  // Mock upload endpoint for local dev when S3/R2 is not connected
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  return NextResponse.json({ ok: true });
}
