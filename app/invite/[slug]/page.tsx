import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EditorialBrutalismTheme } from "@/components/themes/editorial-brutalism/editorial-brutalism-theme";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; preview?: string }>;
}) {
  const { slug } = await params;
  const { to, preview } = await searchParams;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      theme: true,
      media_assets: { orderBy: { order: "asc" } },
      bank_accounts: { include: { bank: true } },
      guests: to ? { where: { OR: [{ slug_token: to }, { name: to }] }, include: { rsvp: true }, take: 1 } : false,
    },
  });

  if (!invitation || (!invitation.is_published && preview !== "true")) {
    notFound();
  }

  const guest = Array.isArray(invitation.guests) ? invitation.guests[0] : null;

  if (guest && !guest.is_opened) {
    await prisma.guest.update({
      where: { id: guest.id },
      data: { is_opened: true, opened_at: new Date() },
    });
  }

  const wishes = await prisma.rsvp.findMany({
    where: {
      wish_message: { not: null },
      guest: { invitation_id: invitation.id },
    },
    include: { guest: true },
    orderBy: { created_at: "desc" },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#D8FB38_0,#F4EFEA_34%,#121212_100%)] md:flex md:justify-center">
      <div className="min-h-screen w-full max-w-canvas bg-[#F4EFEA] shadow-2xl">
        <EditorialBrutalismTheme invitation={invitation} guest={guest} wishes={wishes} />
      </div>
    </div>
  );
}
