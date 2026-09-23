import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  UPLOAD_LIMITS,
  createPresignedUploadUrl,
} from "@/lib/storage";

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

    const mediaAssets = await prisma.mediaAsset.findMany({
      where: { invitation_id: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ mediaAssets });
  } catch (error) {
    console.error("Get media error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil media" },
      { status: 500 }
    );
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

    const body = await req.json();
    const { action } = body;

    // 1. Action: Generate Presigned URL
    if (action === "request-upload") {
      const { type, filename, contentType, fileSize } = body;

      if (!type || !filename || !contentType || !fileSize) {
        return NextResponse.json(
          { error: "type, filename, contentType, dan fileSize wajib disertakan" },
          { status: 400 }
        );
      }

      if (type !== "photo" && type !== "video" && type !== "audio") {
        return NextResponse.json(
          { error: "Tipe media harus photo, video, atau audio" },
          { status: 400 }
        );
      }

      const limit = UPLOAD_LIMITS[type as keyof typeof UPLOAD_LIMITS];
      const maxBytes = limit.maxSizeMB * 1024 * 1024;

      if (fileSize > maxBytes) {
        return NextResponse.json(
          { error: `Ukuran file melebihi batas maksimal ${limit.maxSizeMB} MB` },
          { status: 400 }
        );
      }

      const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = `invitations/${id}/${type}/${Date.now()}-${cleanFilename}`;

      const { uploadUrl, publicUrl } = await createPresignedUploadUrl({
        key,
        contentType,
      });

      return NextResponse.json({ uploadUrl, publicUrl, key });
    }

    // 2. Action: Simpan data asset setelah upload sukses
    if (action === "confirm-upload" || !action) {
      const { type, url, thumbnail_url, order } = body;

      if (!type || !url) {
        return NextResponse.json(
          { error: "type dan url wajib diisi" },
          { status: 400 }
        );
      }

      // TODO: Kompresi media async (BullMQ + Redis worker) - untuk MVP disederhanakan status: "ready"
      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          invitation_id: id,
          type,
          url,
          thumbnail_url: thumbnail_url || null,
          order: typeof order === "number" ? order : 0,
          status: "ready", // ponytail: sinkron langsung ready, ganti background job worker saat kompresi ffmpeg/sharp aktif
        },
      });

      return NextResponse.json({ mediaAsset }, { status: 201 });
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("Upload media error:", error);
    return NextResponse.json(
      { error: "Gagal memproses upload media" },
      { status: 500 }
    );
  }
}
