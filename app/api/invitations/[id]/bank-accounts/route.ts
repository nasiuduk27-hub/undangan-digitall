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

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { invitation_id: id },
      include: { bank: true },
    });

    return NextResponse.json({ bankAccounts });
  } catch (error) {
    console.error("Get bank accounts error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar rekening" },
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
    const { bank_code, account_number, account_holder } = body;

    if (!bank_code || !account_number || !account_holder) {
      return NextResponse.json(
        { error: "Bank, nomor rekening, dan nama pemilik wajib diisi" },
        { status: 400 }
      );
    }

    // Pastikan bank_code valid di master tabel banks
    const bank = await prisma.bank.findUnique({
      where: { code: bank_code },
    });

    if (!bank) {
      return NextResponse.json(
        { error: "Bank tidak valid atau belum terdaftar di master" },
        { status: 400 }
      );
    }

    const account = await prisma.bankAccount.create({
      data: {
        invitation_id: id,
        bank_code,
        account_number: account_number.trim(),
        account_holder: account_holder.trim(),
      },
      include: {
        bank: true,
      },
    });

    return NextResponse.json({ bankAccount: account }, { status: 201 });
  } catch (error) {
    console.error("Create bank account error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan rekening" },
      { status: 500 }
    );
  }
}
