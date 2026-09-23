import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function PUT(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (
    !key ||
    !key.startsWith("invitations/") ||
    key.includes("..") ||
    key.includes("\\") ||
    path.isAbsolute(key)
  ) {
    return NextResponse.json({ error: "Key upload tidak valid" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from(await req.arrayBuffer()));
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  return PUT(req);
}
