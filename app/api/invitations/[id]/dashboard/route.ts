import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: { id, user_id: userId },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const [
      totalGuests,
      openedInvitations,
      rsvps,
      checkInsCount,
      recentCheckIns,
      recentWishes,
    ] = await Promise.all([
      prisma.guest.count({ where: { invitation_id: id } }),
      prisma.guest.count({ where: { invitation_id: id, is_opened: true } }),
      prisma.rsvp.findMany({
        where: { guest: { invitation_id: id } },
        select: { attendance_status: true, pax_count: true },
      }),
      prisma.checkIn.count({
        where: { guest: { invitation_id: id } },
      }),
      prisma.checkIn.findMany({
        where: { guest: { invitation_id: id } },
        include: { guest: { select: { name: true } } },
        orderBy: { checked_in_at: "desc" },
        take: 5,
      }),
      prisma.rsvp.findMany({
        where: {
          guest: { invitation_id: id },
          wish_message: { not: null },
        },
        include: { guest: { select: { name: true } } },
        orderBy: { created_at: "desc" },
        take: 5,
      }),
    ]);

    let hadirCount = 0;
    let raguCount = 0;
    let tidakCount = 0;
    let totalPaxHadir = 0;

    for (const rsvp of rsvps) {
      if (rsvp.attendance_status === "hadir") {
        hadirCount++;
        totalPaxHadir += rsvp.pax_count;
      } else if (rsvp.attendance_status === "ragu") {
        raguCount++;
      } else if (rsvp.attendance_status === "tidak") {
        tidakCount++;
      }
    }

    const totalRsvps = hadirCount + raguCount + tidakCount;

    return NextResponse.json({
      invitationId: id,
      slug: invitation.slug,
      groom_name: invitation.groom_name,
      bride_name: invitation.bride_name,
      totalGuests,
      openedInvitations,
      rsvpSummary: {
        totalRsvps,
        hadir: hadirCount,
        ragu: raguCount,
        tidak: tidakCount,
        pending: Math.max(0, totalGuests - totalRsvps),
        totalPaxHadir,
      },
      checkInSummary: {
        totalCheckedIn: checkInsCount,
        recentCheckIns: recentCheckIns.map((c) => ({
          id: c.id,
          guestName: c.guest.name,
          checkedInAt: c.checked_in_at,
          checkedInBy: c.checked_in_by,
        })),
      },
      recentWishes: recentWishes.map((w) => ({
        id: w.id,
        guestName: w.guest.name,
        message: w.wish_message,
        createdAt: w.created_at,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik dashboard" },
      { status: 500 }
    );
  }
}
