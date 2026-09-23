import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getThemePreset } from "@/lib/themes";

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
      include: {
        theme: true,
        media_assets: true,
        bank_accounts: { include: { bank: true } },
        guests: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Get invitation detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data undangan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existing = await prisma.invitation.findFirst({
      where: { id, user_id: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const updateData: {
      groom_name?: string;
      bride_name?: string;
      event_date?: Date;
      location?: string | null;
      slug?: string;
      theme_id?: string;
      is_published?: boolean;
    } = {};

    if (body.groom_name !== undefined) updateData.groom_name = body.groom_name.trim();
    if (body.bride_name !== undefined) updateData.bride_name = body.bride_name.trim();
    if (body.event_date !== undefined) updateData.event_date = new Date(body.event_date);
    if (body.location !== undefined) updateData.location = body.location ? body.location.trim() : null;
    if (body.theme_id !== undefined) {
      const themePreset = getThemePreset(body.theme_id);
      if (!themePreset) {
        return NextResponse.json({ error: "Tema tidak valid" }, { status: 400 });
      }

      await prisma.theme.upsert({
        where: { id: body.theme_id },
        update: {},
        create: {
          id: body.theme_id,
          ...themePreset,
        },
      });
      updateData.theme_id = body.theme_id;
    }
    if (body.is_published !== undefined) updateData.is_published = Boolean(body.is_published);

    if (body.slug !== undefined && body.slug !== existing.slug) {
      const cleanSlug = body.slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
      const slugConflict = await prisma.invitation.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Slug sudah digunakan oleh undangan lain" },
          { status: 409 }
        );
      }
      updateData.slug = cleanSlug;
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data: updateData,
      include: { theme: true },
    });

    return NextResponse.json({ invitation: updated });
  } catch (error) {
    console.error("Update invitation error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui undangan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const existing = await prisma.invitation.findFirst({
      where: { id, user_id: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Undangan berhasil dihapus" });
  } catch (error) {
    console.error("Delete invitation error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus undangan" },
      { status: 500 }
    );
  }
}
