import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const allowedStatuses = new Set(["hadir", "ragu", "tidak"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { token, attendance_status, pax_count, wish_message } = body;

    if (!token) {
      return NextResponse.json({ error: "Token tamu wajib diisi" }, { status: 400 });
    }

    if (!allowedStatuses.has(attendance_status)) {
      return NextResponse.json({ error: "Status RSVP tidak valid" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { slug } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const guest = await prisma.guest.findFirst({
      where: {
        invitation_id: invitation.id,
        OR: [
          { slug_token: token },
          { name: { equals: token, mode: "insensitive" } },
          { name: { equals: token.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });
    if (!guest) return NextResponse.json({ error: "Tamu tidak valid" }, { status: 404 });

    const rsvp = await prisma.rsvp.upsert({
      where: { guest_id: guest.id },
      update: {
        attendance_status,
        pax_count: Math.max(1, Number(pax_count) || 1),
        wish_message: wish_message?.trim() || null,
      },
      create: {
        guest_id: guest.id,
        attendance_status,
        pax_count: Math.max(1, Number(pax_count) || 1),
        wish_message: wish_message?.trim() || null,
      },
    });

    return NextResponse.json({ rsvp });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: "Gagal menyimpan RSVP" }, { status: 500 });
  }
}
