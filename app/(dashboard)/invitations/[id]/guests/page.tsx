"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, QrCode, Trash2, Users, Share2, Check, ExternalLink, FileText } from "lucide-react";

type Guest = {
  id: string;
  name: string;
  slug_token: string;
  group_label: string | null;
  is_opened: boolean;
  opened_at: string | null;
  rsvp: null | {
    attendance_status: string;
    pax_count: number;
    wish_message: string | null;
  };
};

export default function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitationSlug, setInvitationSlug] = useState("");
  const [names, setNames] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [stats, setStats] = useState({ totalGuests: 0, rsvpHadir: 0, checkedIn: 0 });

  const load = useCallback(async () => {
    const res = await fetch(`/api/invitations/${id}/guests`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data.guests || []);
      setInvitationSlug(data.invitationSlug || "");
    }
    const statsRes = await fetch(`/api/invitations/${id}/checkin-stats`);
    if (statsRes.ok) setStats(await statsRes.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const addGuests = async (event: React.FormEvent) => {
    event.preventDefault();
    const rows = names
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name, group_label: groupLabel || undefined }));

    if (rows.length === 0) return;
    setSaving(true);
    await fetch(`/api/invitations/${id}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guests: rows }),
    });
    setNames("");
    setGroupLabel("");
    await load();
    setSaving(false);
  };

  const removeGuest = async (guestId: string) => {
    if (!confirm("Hapus tamu ini?")) return;
    const res = await fetch(`/api/invitations/${id}/guests/${guestId}`, { method: "DELETE" });
    if (res.ok) setGuests((prev) => prev.filter((guest) => guest.id !== guestId));
  };

  const guestPath = (guest: Guest) => {
    const nameSlug = guest.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${nameSlug ? `${nameSlug}-` : ""}${guest.slug_token}`;
  };

  const copyLink = async (guest: Guest) => {
    const base = window.location.origin;
    await navigator.clipboard.writeText(`${base}/u/${invitationSlug}/${guestPath(guest)}`);
  };

  const copyGeneralLink = async () => {
    const base = window.location.origin;
    await navigator.clipboard.writeText(`${base}/u/${invitationSlug}`);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  const shareWhatsApp = (guest: Guest) => {
    const base = window.location.origin;
    const inviteUrl = `${base}/u/${invitationSlug}/${guestPath(guest)}`;
    const text = `Kepada Yth. ${guest.name}\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\nDetail undangan dapat dilihat pada tautan berikut:\n${inviteUrl}\n\nTerima kasih atas doa & restunya 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href={`/invitations/${id}/edit`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6f63] hover:text-[#2b2420] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Pengaturan Undangan
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2b2420]">Guest Path & RSVP</h1>
        <p className="text-sm text-[#7a6f63] mt-1">
          Tambahkan tamu, salin link personal, dan pantau RSVP.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Diundang" value={stats.totalGuests} />
        <StatCard label="RSVP Hadir" value={stats.rsvpHadir} />
        <StatCard label="Check-in" value={stats.checkedIn} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/scan/${id}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-[#121212] px-4 py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#D8FB38]" />
          Buka Scanner Resepsionis
        </Link>
        <button
          onClick={copyGeneralLink}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#e7ddd0] px-4 py-2.5 text-xs font-semibold text-[#2b2420] hover:bg-[#faf7f2] transition-colors"
        >
          {copiedGeneral ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Link Utama Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#a9724f]" />
              Salin Link Umum Undangan
            </>
          )}
        </button>
        <Link
          href={`/u/${invitationSlug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#e7ddd0] px-4 py-2.5 text-xs font-semibold text-[#a9724f] hover:bg-[#faf7f2] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Buka Undangan (Web)
        </Link>
        <a
          href={`/api/invitations/${id}/export/docx`}
          download
          className="inline-flex items-center gap-2 rounded-xl bg-[#a9724f] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#8f5f40] transition-colors"
        >
          <FileText className="w-4 h-4 text-white" />
          Download Laporan Word (.docx)
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={addGuests} className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="flex items-center gap-2 font-bold text-[#2b2420] mb-4">
            <Users className="w-4 h-4 text-[#a9724f]" /> Tambah Tamu
          </h2>
          <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">Nama tamu</label>
          <textarea
            value={names}
            onChange={(event) => setNames(event.target.value)}
            rows={8}
            className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
            placeholder="Satu nama per baris\nBudi Santoso\nKeluarga Ibu Rina"
          />

          <label className="block text-xs font-semibold text-[#2b2420] mt-4 mb-1.5">Grup (opsional)</label>
          <input
            value={groupLabel}
            onChange={(event) => setGroupLabel(event.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
            placeholder="Keluarga / Kantor / Teman"
          />
          <button
            disabled={saving}
            className="mt-5 w-full py-2.5 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-xs font-semibold rounded-xl disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Generate Link Tamu"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#2b2420]">Daftar Tamu ({guests.length})</h2>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-[#7a6f63]">Memuat tamu...</p>
          ) : guests.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#7a6f63] border-2 border-dashed border-[#e7ddd0] rounded-xl">
              Belum ada tamu.
            </p>
          ) : (
            <div className="space-y-3">
              {guests.map((guest) => (
                <div key={guest.id} className="border border-[#e7ddd0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-[#2b2420]">{guest.name}</p>
                    <p className="text-xs text-[#7a6f63]">
                      {guest.group_label || "Tanpa grup"} • {guest.is_opened ? "Sudah dibuka" : "Belum dibuka"} • RSVP: {guest.rsvp?.attendance_status || "-"}
                    </p>
                    {guest.rsvp?.wish_message && (
                      <p className="text-xs text-[#7a6f63] mt-1 italic">“{guest.rsvp.wish_message}”</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyLink(guest)} title="Salin Tautan" className="px-3 py-2 border border-[#e7ddd0] rounded-lg text-xs font-semibold hover:bg-[#f1e4d8] flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Link
                    </button>
                    <button onClick={() => shareWhatsApp(guest)} title="Bagikan ke WhatsApp" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> WA
                    </button>
                    <button onClick={() => removeGuest(guest.id)} title="Hapus Tamu" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#e7ddd0] bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6f63]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#2b2420]">{value}</p>
    </div>
  );
}
