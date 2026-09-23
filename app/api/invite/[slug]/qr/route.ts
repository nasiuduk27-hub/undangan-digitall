import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { createQrToken } from "@/lib/qr-token";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = new URL(req.url).searchParams.get("to");
    if (!token) return NextResponse.json({ error: "Token tamu wajib diisi" }, { status: 400 });

    const invitation = await prisma.invitation.findUnique({ where: { slug } });
    if (!invitation || !invitation.is_published) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const guest = await prisma.guest.findFirst({
      where: { invitation_id: invitation.id, slug_token: token },
    });
    if (!guest) return NextResponse.json({ error: "Tamu tidak valid" }, { status: 404 });

    const qr_token = createQrToken(guest.slug_token);
    const qr_image = await QRCode.toDataURL(qr_token, { margin: 1, width: 320 });

    return NextResponse.json({ qr_token, qr_image, guest_name: guest.name });
  } catch (error) {
    console.error("QR generate error:", error);
    return NextResponse.json({ error: "Gagal membuat QR" }, { status: 500 });
  }
}
