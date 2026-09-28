"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { PreviewToggle, type PreviewMode } from "@/components/editor/PreviewToggle";
import { IPhoneFrame } from "@/components/editor/IPhoneFrame";
import { BrowserFrame } from "@/components/editor/BrowserFrame";
import { ThemeRenderer } from "@/components/themes/theme-renderer";
import { THEME_PRESETS } from "@/lib/themes";

const DUMMY_INVITATION = (themeSlug: string) => ({
  slug: `pratinjau-${themeSlug}`,
  theme_id: themeSlug,
  groom_name: "Rian Pratama",
  bride_name: "Sarah Anindya",
  event_date: new Date("2026-12-20T10:00:00.000Z"),
  location: "Grand Ballroom Hotel Indonesia Kempinski, Jakarta",
  media_assets: [
    {
      id: "m1",
      type: "photo",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
      status: "ready",
    },
    {
      id: "m2",
      type: "photo",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
      status: "ready",
    },
  ],
  bank_accounts: [
    {
      id: "b1",
      bank_code: "bca",
      account_number: "1234567890",
      account_holder: "Rian Pratama",
      bank: { name: "Bank Central Asia (BCA)", logo_url: "/banks/bca.png" },
    },
    {
      id: "b2",
      bank_code: "mandiri",
      account_number: "9876543210",
      account_holder: "Sarah Anindya",
      bank: { name: "Bank Mandiri", logo_url: "/banks/mandiri.png" },
    },
  ],
});

const DUMMY_GUEST = {
  name: "Bapak / Ibu / Saudara(i)",
  slug_token: "demo-guest-token",
  rsvp: null,
};

const DUMMY_WISHES = [
  {
    id: "w1",
    wish_message: "Selamat ya Rian & Sarah! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    guest: { name: "Dimas & Keluarga" },
  },
  {
    id: "w2",
    wish_message: "Happy wedding! Berkah selalu dan bahagia selamanya.",
    guest: { name: "Anita S." },
  },
];

export default function PublicThemePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [mode, setMode] = useState<PreviewMode>("desktop");

  const themeInfo = THEME_PRESETS[slug as keyof typeof THEME_PRESETS];
  const themeName = themeInfo?.name || slug;

  const handleUseTheme = () => {
    if (session) {
      router.push(`/invitations/new?theme=${slug}`);
    } else {
      router.push(`/register?theme=${slug}`);
    }
  };

  const dummyData = DUMMY_INVITATION(slug);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e7ddd0] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/#tema"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6f63] hover:text-[#2b2420] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog
            </Link>

            <div className="h-4 w-px bg-[#e7ddd0] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2b2420]">
                {themeName}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e7ddd0] text-[#7a6f63]">
                Pratinjau Demo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <PreviewToggle mode={mode} onChange={setMode} />

            <button
              type="button"
              onClick={handleUseTheme}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#a9724f] text-white text-xs font-semibold hover:bg-[#8f5f40] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gunakan Tema Ini
            </button>
          </div>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <div className="w-full transition-all duration-300">
          {mode === "mobile" ? (
            <IPhoneFrame>
              <ThemeRenderer
                invitation={dummyData}
                guest={DUMMY_GUEST}
                wishes={DUMMY_WISHES}
              />
            </IPhoneFrame>
          ) : (
            <BrowserFrame invitationSlug={dummyData.slug}>
              <ThemeRenderer
                invitation={dummyData}
                guest={DUMMY_GUEST}
                wishes={DUMMY_WISHES}
              />
            </BrowserFrame>
          )}
        </div>
      </main>

      {/* Footer Banner */}
      <div className="bg-[#2b2420] text-white py-3 px-4 text-center text-xs font-medium flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#a9724f]" />
        <span>Suka dengan tampilan tema <strong>{themeName}</strong>? Klik &quot;Gunakan Tema Ini&quot; untuk langsung membuat undangan Anda.</span>
      </div>
    </div>
  );
}
