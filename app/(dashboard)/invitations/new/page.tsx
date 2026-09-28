"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const THEMES = [
  {
    id: "editorial-brutalism",
    name: "Editorial Brutalism",
    category: "Modern / Bold",
    desc: "Border tegas 2px, shadow tanpa blur, grid asimetris, Syne + Space Mono",
    palette: ["#F4EFEA", "#121212", "#D8FB38"],
  },
  {
    id: "raw-wabi-sabi",
    name: "Raw Wabi-Sabi",
    category: "Organic / Elegant",
    desc: "Sudut organik tak beraturan, tekstur grain halus, Garamond + Plus Jakarta Sans",
    palette: ["#EBE5DC", "#A85A3C", "#BFA054"],
  },
  {
    id: "cyber-celestial-noir",
    name: "Cyber-Celestial Noir",
    category: "Dark / Futuristic",
    desc: "Dark mode murni, glassmorphism, neon glow lembut, Cinzel + Outfit",
    palette: ["#0C0E14", "#00F5D4", "#7B2CBF"],
  },
  {
    id: "70s-warm-groovy",
    name: "70s Warm Groovy",
    category: "Retro / Warm",
    desc: "Bentuk pil tebal, wavy divider, badge stempel vintage, Fraunces + DM Sans",
    palette: ["#FDF8EE", "#D96B27", "#EBB035"],
  },
];

function NewInvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");

  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeParam || "editorial-brutalism");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (themeParam && THEMES.some((t) => t.id === themeParam)) {
      setSelectedTheme(themeParam);
    }
  }, [themeParam]);

  // Auto preview slug
  const cleanGroom = groomName.toLowerCase().replace(/\s+/g, "");
  const cleanBride = brideName.toLowerCase().replace(/\s+/g, "");
  const suggestedSlug = cleanGroom && cleanBride ? `${cleanGroom}-${cleanBride}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groom_name: groomName,
          bride_name: brideName,
          event_date: eventDate,
          location: location || null,
          slug: slug.trim() || suggestedSlug,
          theme_id: selectedTheme,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat undangan");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6f63] hover:text-[#2b2420] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#a9724f]">
            Langkah 1
          </span>
          <h1 className="text-2xl font-bold text-[#2b2420] mt-0.5">
            Buat Undangan Baru
          </h1>
          <p className="text-sm text-[#7a6f63] mt-1">
            Isi data dasar kedua mempelai dan tentukan tema visual awal.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                Nama Mempelai Pria *
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Contoh: Rian Pratama"
                className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                Nama Mempelai Wanita *
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Contoh: Sarah Anindya"
                className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                Tanggal & Waktu Acara *
              </label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                Lokasi / Venue Acara
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Grand Ballroom Hotel Indonesia"
                className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
              Kustomisasi Slug URL (Opsional)
            </label>
            <div className="flex items-center bg-[#faf7f2] border border-[#e7ddd0] rounded-xl overflow-hidden px-3.5 py-2.5 text-sm">
              <span className="text-[#7a6f63] select-none text-xs">
                /invite/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={suggestedSlug || "rian-sarah"}
                className="w-full bg-transparent text-sm focus:outline-none ml-1 text-[#2b2420]"
              />
            </div>
            <p className="text-[11px] text-[#7a6f63] mt-1">
              Link publik: /invite/
              {slug.trim() || suggestedSlug || "nama-pasangan"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b2420] mb-2.5">
              Pilih Tema Awal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`cursor-pointer border rounded-xl p-3.5 transition-all text-left ${
                      isSelected
                        ? "border-[#a9724f] bg-[#fdfbf9] ring-2 ring-[#a9724f]/20 shadow-sm"
                        : "border-[#e7ddd0] bg-white hover:border-[#a9724f]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-xs text-[#2b2420]">
                        {theme.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {theme.palette.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7a6f63] line-clamp-2 leading-relaxed">
                      {theme.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7ddd0] flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 border border-[#e7ddd0] text-[#7a6f63] hover:text-[#2b2420] text-sm font-medium rounded-xl transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan & Lanjut"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewInvitationPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#7a6f63]">Memuat...</div>}>
      <NewInvitationForm />
    </Suspense>
  );
}
