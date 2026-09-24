import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ThemeRenderer } from "@/components/themes/theme-renderer";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; guestSlug?: string }>;
  searchParams: Promise<{ to?: string; preview?: string }>;
}) {
  const { slug, guestSlug } = await params;
  const { to: queryTo, preview } = await searchParams;

  const rawTo = guestSlug ? decodeURIComponent(guestSlug) : queryTo;
  const to = rawTo ? rawTo.trim() : undefined;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      theme: true,
      media_assets: { orderBy: { order: "asc" } },
      bank_accounts: { include: { bank: true } },
      guests: to
        ? {
            where: {
              OR: [
                { slug_token: to },
                { name: { equals: to, mode: "insensitive" } },
                { name: { equals: to.replace(/-/g, " "), mode: "insensitive" } },
              ],
            },
            include: { rsvp: true },
            take: 1,
          }
        : false,
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
    <div className="min-h-screen w-full">
      <ThemeRenderer invitation={invitation} guest={guest} wishes={wishes} />
    </div>
  );
}
