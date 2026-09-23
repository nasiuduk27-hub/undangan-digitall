"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";

const THEMES = [
  {
    id: "editorial-brutalism",
    name: "Editorial Brutalism",
    palette: ["#F4EFEA", "#121212", "#D8FB38"],
  },
  {
    id: "raw-wabi-sabi",
    name: "Raw Wabi-Sabi",
    palette: ["#EBE5DC", "#A85A3C", "#BFA054"],
  },
  {
    id: "cyber-celestial-noir",
    name: "Cyber-Celestial Noir",
    palette: ["#0C0E14", "#00F5D4", "#7B2CBF"],
  },
  {
    id: "70s-warm-groovy",
    name: "70s Warm Groovy",
    palette: ["#FDF8EE", "#D96B27", "#EBB035"],
  },
];

export default function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("editorial-brutalism");
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/invitations/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Gagal mengambil data undangan");
        const data = await res.json();
        const inv = data.invitation;
        setGroomName(inv.groom_name);
        setBrideName(inv.bride_name);
        // Format to YYYY-MM-DDTHH:mm for datetime-local
        if (inv.event_date) {
          const d = new Date(inv.event_date);
          const offset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d.getTime() - offset)
            .toISOString()
            .slice(0, 16);
          setEventDate(localISOTime);
        }
        setLocation(inv.location || "");
        setSlug(inv.slug);
        setSelectedTheme(inv.theme_id || "editorial-brutalism");
        setIsPublished(Boolean(inv.is_published));
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`/api/invitations/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groom_name: groomName,
          bride_name: brideName,
          event_date: eventDate,
          location: location || null,
          slug: slug.trim(),
          theme_id: selectedTheme,
          is_published: isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui undangan");
      }

      setSuccess("Perubahan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 4000);
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

  if (fetching) {
    return (
      <div className="py-20 text-center text-sm text-[#7a6f63]">
        Memuat data undangan...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6f63] hover:text-[#2b2420] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Dashboard
        </Link>
        <Link
          href={`/invite/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-[#a9724f] font-semibold hover:underline"
        >
          Lihat Halaman Tamu
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2b2420]">
            Edit Data Undangan
          </h1>
          <p className="text-sm text-[#7a6f63] mt-1">
            Ubah informasi dasar, tema, atau status publikasi undangan Anda.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Publikasi Switch */}
          <div className="flex items-center justify-between p-4 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[#2b2420]">
                Status Publikasi
              </p>
              <p className="text-xs text-[#7a6f63]">
                {isPublished
                  ? "Undangan dapat diakses publik oleh tamu."
                  : "Undangan tersimpan sebagai draft (privat)."}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a9724f]"></div>
            </label>
          </div>

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
                className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
              Slug URL
            </label>
            <div className="flex items-center bg-[#faf7f2] border border-[#e7ddd0] rounded-xl overflow-hidden px-3.5 py-2.5 text-sm">
              <span className="text-[#7a6f63] select-none text-xs">
                /invite/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none ml-1 text-[#2b2420]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b2420] mb-2.5">
              Ganti Tema
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
                    <div className="flex items-center justify-between gap-2">
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7ddd0] flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
