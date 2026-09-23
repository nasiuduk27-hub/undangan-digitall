import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    const { id, guestId } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invitation = await prisma.invitation.findFirst({ where: { id, user_id: userId } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const guest = await prisma.guest.findFirst({ where: { id: guestId, invitation_id: id } });
    if (!guest) return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });

    await prisma.guest.delete({ where: { id: guestId } });
    return NextResponse.json({ message: "Tamu berhasil dihapus" });
  } catch (error) {
    console.error("Delete guest error:", error);
    return NextResponse.json({ error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
