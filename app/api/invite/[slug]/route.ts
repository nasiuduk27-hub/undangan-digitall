import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("to");

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        theme: true,
        media_assets: { orderBy: { order: "asc" } },
        bank_accounts: { include: { bank: true } },
        guests: token ? { where: { slug_token: token }, take: 1 } : false,
      },
    });

    if (!invitation || !invitation.is_published) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Public invite error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil undangan" },
      { status: 500 }
    );
  }
}
