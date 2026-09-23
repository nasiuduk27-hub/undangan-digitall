import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteStorageObject } from "@/lib/storage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const { id, mediaId } = await params;
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

    const media = await prisma.mediaAsset.findFirst({
      where: { id: mediaId, invitation_id: id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.mediaAsset.delete({
      where: { id: mediaId },
    });

    // Coba hapus dari S3 jika URL mengandung key
    if (media.url && !media.url.startsWith("data:")) {
      const parts = media.url.split("/invitations/");
      if (parts.length > 1) {
        const key = `invitations/${parts[1]}`;
        await deleteStorageObject(key).catch(console.error);
      }
    }

    return NextResponse.json({ message: "Media berhasil dihapus" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus media" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const { id, mediaId } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { order } = body;

    const updated = await prisma.mediaAsset.update({
      where: { id: mediaId, invitation_id: id },
      data: {
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json({ mediaAsset: updated });
  } catch (error) {
    console.error("Update media error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui urutan media" },
      { status: 500 }
    );
  }
}
