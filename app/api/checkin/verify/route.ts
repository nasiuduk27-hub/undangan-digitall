import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyQrToken } from "@/lib/qr-token";

export async function POST(req: Request) {
  try {
    const { qr_token, invitation_id, checked_in_by } = await req.json();
    if (!qr_token) return NextResponse.json({ status: "tidak-valid" }, { status: 400 });

    const slugToken = verifyQrToken(qr_token);
    if (!slugToken) return NextResponse.json({ status: "tidak-valid" }, { status: 400 });

    const guest = await prisma.guest.findUnique({
      where: { slug_token: slugToken },
      include: { invitation: true, check_in: true, rsvp: true },
    });
    if (!guest) return NextResponse.json({ status: "tidak-valid" }, { status: 404 });
    if (invitation_id && guest.invitation_id !== invitation_id) {
      return NextResponse.json({ status: "tidak-valid" }, { status: 400 });
    }

    if (guest.check_in) {
      return NextResponse.json({
        status: "sudah-dipakai",
        guest_name: guest.name,
        invitation_id: guest.invitation_id,
      });
    }

    await prisma.checkIn.create({
      data: {
        guest_id: guest.id,
        qr_token,
        checked_in_by: checked_in_by || null,
        checkin_status: "valid",
      },
    });

    if (!guest.rsvp) {
      await prisma.rsvp.create({
        data: {
          guest_id: guest.id,
          attendance_status: "hadir",
          pax_count: 1,
        },
      });
    }

    return NextResponse.json({
      status: "valid",
      guest_name: guest.name,
      invitation_id: guest.invitation_id,
    });
  } catch (error) {
    console.error("Check-in verify error:", error);
    return NextResponse.json({ status: "tidak-valid" }, { status: 500 });
  }
}
