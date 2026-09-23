import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function token() {
  return randomBytes(8).toString("hex");
}

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
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const guests = await prisma.guest.findMany({
      where: { invitation_id: id },
      include: { rsvp: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ guests, invitationSlug: invitation.slug });
  } catch (error) {
    console.error("Get guests error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar tamu" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invitation = await prisma.invitation.findFirst({ where: { id, user_id: userId } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const rawGuests = Array.isArray(body.guests)
      ? body.guests
      : [{ name: body.name, group_label: body.group_label }];

    const rows = rawGuests
      .map((guest: { name?: string; group_label?: string }) => ({
        name: guest.name?.trim(),
        group_label: guest.group_label?.trim() || null,
      }))
      .filter((guest: { name?: string | null }) => guest.name);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Minimal satu nama tamu wajib diisi" }, { status: 400 });
    }

    const created = [];
    for (const guest of rows) {
      created.push(
        await prisma.guest.create({
          data: {
            invitation_id: id,
            name: guest.name as string,
            group_label: guest.group_label,
            slug_token: token(),
          },
          include: { rsvp: true },
        })
      );
    }

    return NextResponse.json({ guests: created }, { status: 201 });
  } catch (error) {
    console.error("Create guests error:", error);
    return NextResponse.json({ error: "Gagal menambahkan tamu" }, { status: 500 });
  }
}
