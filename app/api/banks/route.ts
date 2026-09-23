import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { INITIAL_BANKS } from "@/lib/banks-data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();

    let count = await prisma.bank.count();
    if (count === 0) {
      // Auto-seed banks on first query
      for (const bank of INITIAL_BANKS) {
        await prisma.bank.upsert({
          where: { code: bank.code },
          update: {},
          create: bank,
        });
      }
    }

    const banks = await prisma.bank.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ banks });
  } catch (error) {
    console.error("Get banks error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar bank" },
      { status: 500 }
    );
  }
}
