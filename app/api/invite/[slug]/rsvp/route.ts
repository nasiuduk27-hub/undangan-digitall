import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const allowedStatuses = new Set(["hadir", "ragu", "mungkin", "tidak"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { token, sender_name, is_anonymous, pax_count, wish_message } = body;
    let { attendance_status } = body;

    if (attendance_status === "mungkin") {
      attendance_status = "ragu";
    }

    if (attendance_status && !allowedStatuses.has(attendance_status)) {
      return NextResponse.json({ error: "Status RSVP tidak valid" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { slug } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    let targetToken = token || "tamu-umum";
    let guest = null;

    if (targetToken && targetToken !== "tamu-umum") {
      guest = await prisma.guest.findFirst({
        where: {
          invitation_id: invitation.id,
          OR: [
            { slug_token: targetToken },
            { name: { equals: targetToken, mode: "insensitive" } },
            { name: { equals: targetToken.replace(/-/g, " "), mode: "insensitive" } },
          ],
        },
        include: { rsvp: true },
      });
    }

    if (!guest) {
      let displayName = "Anonim";
      if (!is_anonymous && sender_name && sender_name.trim()) {
        displayName = sender_name.trim();
      } else if (!is_anonymous && targetToken && targetToken !== "tamu-umum") {
        displayName = targetToken;
      }

      const uniqueSlug = `pub-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
      guest = await prisma.guest.create({
        data: {
          invitation_id: invitation.id,
          name: displayName,
          slug_token: uniqueSlug,
        },
        include: { rsvp: true },
      });
    } else if (!is_anonymous && sender_name && sender_name.trim() && guest.name !== sender_name.trim()) {
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: { name: sender_name.trim() },
        include: { rsvp: true },
      });
    }

    const existingRsvp = guest.rsvp;
    const finalStatus = attendance_status || existingRsvp?.attendance_status || "hadir";
    const finalPax =
      pax_count !== undefined && pax_count !== null
        ? Math.max(1, Number(pax_count) || 1)
        : existingRsvp?.pax_count ?? 1;
    const finalWish =
      wish_message !== undefined
        ? wish_message?.trim() || null
        : existingRsvp?.wish_message ?? null;

    const rsvp = await prisma.rsvp.upsert({
      where: { guest_id: guest.id },
      update: {
        attendance_status: finalStatus,
        pax_count: finalPax,
        wish_message: finalWish,
      },
      create: {
        guest_id: guest.id,
        attendance_status: finalStatus,
        pax_count: finalPax,
        wish_message: finalWish,
      },
    });

    return NextResponse.json({ rsvp, guest });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: "Gagal menyimpan RSVP" }, { status: 500 });
  }
}
