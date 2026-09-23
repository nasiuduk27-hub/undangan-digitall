"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Calendar, MapPin, Eye, Edit3, Trash2, ExternalLink } from "lucide-react";

interface Invitation {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  location: string | null;
  is_published: boolean;
  theme: {
    name: string;
  };
  _count: {
    guests: number;
    media_assets: number;
  };
}

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus undangan ini?")) return;

    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2b2420]">Undangan Pernikahan</h1>
          <p className="text-sm text-[#7a6f63]">
            Kelola data dan pantau undangan pernikahan Anda
          </p>
        </div>
        <Link
          href="/invitations/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-sm font-medium rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Buat Undangan Baru
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#7a6f63]">
          Memuat data undangan...
        </div>
      ) : invitations.length === 0 ? (
        <div className="bg-white border border-[#e7ddd0] rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#f1e4d8] text-[#a9724f] flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#2b2420]">
            Belum ada undangan
          </h3>
          <p className="text-sm text-[#7a6f63] mt-1 mb-6">
            Mulai buat undangan pernikahan digital Anda hanya dalam beberapa menit.
          </p>
          <Link
            href="/invitations/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#a9724f] text-white text-sm font-medium rounded-xl hover:bg-[#8f5f40] transition-colors"
          >
            Buat Undangan Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitations.map((inv) => {
            const dateStr = new Date(inv.event_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={inv.id}
                className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        inv.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {inv.is_published ? "Dipublikasikan" : "Draft"}
                    </span>
                    <span className="text-xs text-[#7a6f63] font-medium bg-[#faf7f2] px-2.5 py-1 rounded-md border border-[#e7ddd0]">
                      Tema: {inv.theme?.name || "Editorial Brutalism"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#2b2420] tracking-tight">
                    {inv.groom_name} & {inv.bride_name}
                  </h2>

                  <div className="mt-3 space-y-1 text-xs text-[#7a6f63]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#a9724f]" />
                      <span>{dateStr}</span>
                    </div>
                    {inv.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#a9724f]" />
                        <span>{inv.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f1e4d8] flex items-center gap-4 text-xs text-[#7a6f63]">
                    <span>{inv._count?.guests || 0} Tamu</span>
                    <span>•</span>
                    <span>{inv._count?.media_assets || 0} Media</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7ddd0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/invite/${inv.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f1e4d8] text-[#2b2420] text-xs font-semibold rounded-lg border border-[#e7ddd0] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#a9724f]" />
                      Lihat
                    </Link>
                    <Link
                      href={`/invitations/${inv.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f1e4d8] text-[#2b2420] text-xs font-semibold rounded-lg border border-[#e7ddd0] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#a9724f]" />
                      Edit
                    </Link>
                    <Link
                      href={`/invitations/${inv.id}/media`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f1e4d8] text-[#2b2420] text-xs font-semibold rounded-lg border border-[#e7ddd0] transition-colors"
                    >
                      Media
                    </Link>
                    <Link
                      href={`/invitations/${inv.id}/banks`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f1e4d8] text-[#2b2420] text-xs font-semibold rounded-lg border border-[#e7ddd0] transition-colors"
                    >
                      Rekening
                    </Link>
                    <Link
                      href={`/invitations/${inv.id}/guests`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f1e4d8] text-[#2b2420] text-xs font-semibold rounded-lg border border-[#e7ddd0] transition-colors"
                    >
                      Tamu
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="p-1.5 text-[#7a6f63] hover:text-red-600 rounded-lg transition-colors"
                    title="Hapus Undangan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
