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
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invitation = await prisma.invitation.findFirst({ where: { id, user_id: userId } });
    if (!invitation) return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });

    const [totalGuests, rsvpHadir, checkedIn] = await Promise.all([
      prisma.guest.count({ where: { invitation_id: id } }),
      prisma.rsvp.count({
        where: { attendance_status: "hadir", guest: { invitation_id: id } },
      }),
      prisma.checkIn.count({
        where: { checkin_status: "valid", guest: { invitation_id: id } },
      }),
    ]);

    return NextResponse.json({ totalGuests, rsvpHadir, checkedIn });
  } catch (error) {
    console.error("Check-in stats error:", error);
    return NextResponse.json({ error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
