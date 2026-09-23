import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; accountId: string }> }
) {
  try {
    const { id, accountId } = await params;
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

    const account = await prisma.bankAccount.findFirst({
      where: { id: accountId, invitation_id: id },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Rekening tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.bankAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ message: "Rekening berhasil dihapus" });
  } catch (error) {
    console.error("Delete bank account error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus rekening" },
      { status: 500 }
    );
  }
}
