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
    const preview = searchParams.get("preview");

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        theme: true,
        media_assets: { orderBy: { order: "asc" } },
        bank_accounts: { include: { bank: true } },
        guests: token
          ? {
              where: {
                OR: [
                  { slug_token: token },
                  { slug_token: token.slice(-16) },
                  { name: { equals: token, mode: "insensitive" } },
                  { name: { equals: token.replace(/-/g, " "), mode: "insensitive" } },
                ],
              },
              include: { rsvp: true },
              take: 1,
            }
          : false,
      },
    });

    if (!invitation || (!invitation.is_published && preview !== "true")) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (Array.isArray(invitation.guests) && invitation.guests[0] && !invitation.guests[0].is_opened) {
      await prisma.guest.update({
        where: { id: invitation.guests[0].id },
        data: { is_opened: true, opened_at: new Date() },
      });
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
