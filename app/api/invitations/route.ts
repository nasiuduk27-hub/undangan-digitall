import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      where: { user_id: userId },
      include: {
        theme: true,
        _count: {
          select: {
            guests: true,
            media_assets: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Get invitations error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data undangan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { groom_name, bride_name, event_date, location, slug, theme_id } = body;

    if (!groom_name || !bride_name || !event_date) {
      return NextResponse.json(
        { error: "Nama pengantin pria, wanita, dan tanggal acara wajib diisi" },
        { status: 400 }
      );
    }

    // Buat slug otomatis jika tidak disediakan
    let generatedSlug =
      slug?.trim() ||
      `${groom_name.toLowerCase().replace(/\s+/g, "")}-${bride_name.toLowerCase().replace(/\s+/g, "")}`;
    generatedSlug = generatedSlug.replace(/[^a-z0-9-]/gi, "").toLowerCase();

    // Pastikan slug unik
    const existing = await prisma.invitation.findUnique({
      where: { slug: generatedSlug },
    });
    if (existing) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Pastikan tema tersedia (jika belum ada, buat tema default)
    let selectedThemeId = theme_id;
    if (!selectedThemeId) {
      const defaultTheme = await prisma.theme.upsert({
        where: { id: "editorial-brutalism" },
        update: {},
        create: {
          id: "editorial-brutalism",
          name: "Editorial Brutalism",
          category: "Modern",
          is_premium: false,
          config_json: {
            palette: ["#F4EFEA", "#121212", "#D8FB38"],
            fontHeader: "Syne ExtraBold",
            fontBody: "Space Mono",
          },
        },
      });
      selectedThemeId = defaultTheme.id;
    }

    const invitation = await prisma.invitation.create({
      data: {
        user_id: userId,
        slug: generatedSlug,
        groom_name: groom_name.trim(),
        bride_name: bride_name.trim(),
        event_date: new Date(event_date),
        location: location?.trim() || null,
        theme_id: selectedThemeId,
        is_published: false,
      },
      include: {
        theme: true,
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("Create invitation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat undangan" },
      { status: 500 }
    );
  }
}
