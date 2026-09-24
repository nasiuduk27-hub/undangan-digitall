import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
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
      include: {
        guests: {
          include: {
            rsvp: true,
            check_in: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const guests = invitation.guests;
    const totalGuests = guests.length;
    const checkedInGuests = guests.filter((g) => g.check_in !== null);
    const checkedInCount = checkedInGuests.length;
    const rsvpHadirCount = guests.filter((g) => g.rsvp?.attendance_status === "hadir").length;
    const rsvpTidakCount = guests.filter((g) => g.rsvp?.attendance_status === "tidak").length;
    const rsvpRaguCount = guests.filter((g) => g.rsvp?.attendance_status === "ragu").length;
    const belumRsvpCount = guests.filter((g) => !g.rsvp).length;

    const notCheckedInGuests = guests.filter((g) => g.check_in === null);

    const borderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "CCCCCC",
    };
    const borders = {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle,
    };

    // Header Table Helper
    const createTableCell = (
      text: string,
      bold = false,
      bgColor = "FFFFFF",
      widthPercent = 20
    ) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold,
                size: 20, // 10pt
                font: "Calibri",
              }),
            ],
          }),
        ],
        shading: { fill: bgColor },
        width: { size: widthPercent, type: WidthType.PERCENTAGE },
        borders,
      });

    // Present Guests Table Rows
    const presentTableRows = [
      new TableRow({
        children: [
          createTableCell("No", true, "F2F2F2", 5),
          createTableCell("Nama Tamu", true, "F2F2F2", 25),
          createTableCell("Grup", true, "F2F2F2", 15),
          createTableCell("RSVP", true, "F2F2F2", 15),
          createTableCell("Pax", true, "F2F2F2", 10),
          createTableCell("Waktu Check-in", true, "F2F2F2", 30),
        ],
      }),
      ...checkedInGuests.map((g, index) => {
        const timeStr = g.check_in?.checked_in_at
          ? new Date(g.check_in.checked_in_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "-";

        return new TableRow({
          children: [
            createTableCell((index + 1).toString(), false, "FFFFFF", 5),
            createTableCell(g.name, false, "FFFFFF", 25),
            createTableCell(g.group_label || "-", false, "FFFFFF", 15),
            createTableCell(g.rsvp?.attendance_status || "Belum", false, "FFFFFF", 15),
            createTableCell((g.rsvp?.pax_count || 1).toString(), false, "FFFFFF", 10),
            createTableCell(timeStr, false, "FFFFFF", 30),
          ],
        });
      }),
    ];

    // Absent/Unconfirmed Guests Table Rows
    const absentTableRows = [
      new TableRow({
        children: [
          createTableCell("No", true, "F2F2F2", 5),
          createTableCell("Nama Tamu", true, "F2F2F2", 25),
          createTableCell("Grup", true, "F2F2F2", 15),
          createTableCell("Status RSVP", true, "F2F2F2", 15),
          createTableCell("Pesan / Ucapan", true, "F2F2F2", 40),
        ],
      }),
      ...notCheckedInGuests.map((g, index) => {
        return new TableRow({
          children: [
            createTableCell((index + 1).toString(), false, "FFFFFF", 5),
            createTableCell(g.name, false, "FFFFFF", 25),
            createTableCell(g.group_label || "-", false, "FFFFFF", 15),
            createTableCell(g.rsvp?.attendance_status || "Belum Konfirmasi", false, "FFFFFF", 15),
            createTableCell(g.rsvp?.wish_message || "-", false, "FFFFFF", 40),
          ],
        });
      }),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "LAPORAN KEHADIRAN TAMU UNDANGAN",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${invitation.groom_name} & ${invitation.bride_name}`,
                  bold: true,
                  size: 28,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Tanggal Acara: ${new Date(invitation.event_date).toLocaleDateString("id-ID", { dateStyle: "full" })}`,
                  italics: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 400 },
            }),

            // Summary Section
            new Paragraph({
              text: "Ringkasan Statistik Kehadiran",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Total Tamu Diundang: `, bold: true }),
                new TextRun({ text: `${totalGuests} Orang` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Tamu Sudah Check-in (Hadir Fisik): `, bold: true }),
                new TextRun({ text: `${checkedInCount} Orang` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Konfirmasi RSVP Hadir: `, bold: true }),
                new TextRun({ text: `${rsvpHadirCount} Orang` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Konfirmasi RSVP Tidak Hadir: `, bold: true }),
                new TextRun({ text: `${rsvpTidakCount} Orang` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Konfirmasi RSVP Ragu: `, bold: true }),
                new TextRun({ text: `${rsvpRaguCount} Orang` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `• Belum Konfirmasi RSVP: `, bold: true }),
                new TextRun({ text: `${belumRsvpCount} Orang` }),
              ],
              spacing: { after: 300 },
            }),

            // Present Table Section
            new Paragraph({
              text: `1. Riwayat Tamu Hadir (${checkedInCount} Orang)`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
            }),
            ...(checkedInCount > 0
              ? [
                  new Table({
                    rows: presentTableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                  }),
                ]
              : [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Belum ada tamu yang check-in pada lokasi acara)",
                        italics: true,
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]),

            // Absent / Unconfirmed Table Section
            new Paragraph({
              text: `2. Daftar Tamu Belum Check-in / Tidak Hadir (${notCheckedInGuests.length} Orang)`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 100 },
            }),
            ...(notCheckedInGuests.length > 0
              ? [
                  new Table({
                    rows: absentTableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                  }),
                ]
              : [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Semua tamu diundang telah hadir di lokasi acara)",
                        italics: true,
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `Laporan-Tamu-${invitation.slug}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export DOCX error:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen Word" },
      { status: 500 }
    );
  }
}
