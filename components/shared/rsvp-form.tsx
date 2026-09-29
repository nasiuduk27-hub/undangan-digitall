"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Sparkles, Edit3 } from "lucide-react";

export function RsvpForm({
  slug,
  token,
  guestName,
  initialStatus,
  initialPax = 1,
  initialWish = "",
  themeId = "editorial-brutalism",
}: {
  slug: string;
  token: string;
  guestName: string;
  initialStatus?: string | null;
  initialPax?: number;
  initialWish?: string | null;
  themeId?: string;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(initialStatus || null);
  const [paxCount, setPaxCount] = useState<number>(initialPax || 1);
  const [wishMessage, setWishMessage] = useState<string>(initialWish || "");
  const [isSavingQuick, setIsSavingQuick] = useState<boolean>(false);
  const [isSavingDetail, setIsSavingDetail] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const currentToken = token || guestName || "tamu-umum";

  const handleQuickPick = async (status: "hadir" | "tidak" | "ragu") => {
    setSelectedStatus(status);
    setIsSavingQuick(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/invite/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: currentToken,
          attendance_status: status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan konfirmasi");
      }

      setIsModalOpen(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal menyimpan RSVP");
    } finally {
      setIsSavingQuick(false);
    }
  };

  const handleDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetail(true);
    setErrorMessage("");
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/invite/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: currentToken,
          attendance_status: selectedStatus || "hadir",
          pax_count: paxCount,
          wish_message: wishMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan RSVP");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal menyimpan RSVP");
    } finally {
      setIsSavingDetail(false);
    }
  };

  const isCyber = themeId === "cyber-celestial-noir";
  const isGroovy = themeId === "70s-warm-groovy";
  const isWabi = themeId === "raw-wabi-sabi";
  const isBrutalist = themeId === "editorial-brutalism" || (!isCyber && !isGroovy && !isWabi);

  const containerStyle = isCyber
    ? "border border-[#00F5D4]/40 bg-[#151A24] p-5 lg:p-6 text-[#F4F7FB] rounded-2xl shadow-[0_0_20px_rgba(0,245,212,0.15)] font-mono"
    : isGroovy
    ? "border-2 border-[#D96B27] bg-[#FFF2D0] p-5 lg:p-6 text-[#3A2418] rounded-3xl shadow-[5px_5px_0_#D96B27] font-sans"
    : isWabi
    ? "border border-[#2E241D]/30 bg-[#F7F0E8] p-5 lg:p-6 text-[#2E241D] rounded-xl shadow-sm font-serif"
    : "border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]";

  const tagStyle = isCyber
    ? "font-mono text-xs uppercase tracking-[0.2em] text-[#00F5D4]"
    : isGroovy
    ? "font-serif text-xs font-bold uppercase tracking-wider text-[#D96B27]"
    : isWabi
    ? "font-serif text-xs uppercase tracking-widest text-[#2E241D]/60"
    : "font-mono text-xs uppercase tracking-[0.2em] text-black/60";

  const titleStyle = isCyber
    ? "mt-2 text-2xl font-bold uppercase leading-none tracking-wide text-[#F4F7FB]"
    : isGroovy
    ? "mt-2 font-serif text-2xl font-bold uppercase leading-none text-[#D96B27]"
    : isWabi
    ? "mt-2 font-serif text-2xl font-normal uppercase leading-none text-[#2E241D]"
    : "mt-2 text-2xl font-black uppercase leading-none";

  const subStyle = isCyber
    ? "mt-3 text-sm text-[#F4F7FB]/70 font-mono"
    : isGroovy
    ? "mt-3 text-sm text-[#3A2418]/80 font-sans"
    : isWabi
    ? "mt-3 text-sm text-[#2E241D]/80 font-serif"
    : "mt-3 text-sm text-black/70";

  return (
    <section id="rsvp" className={containerStyle}>
      <p className={tagStyle}>RSVP</p>
      <h2 className={titleStyle}>Konfirmasi Hadir</h2>
      <p className={subStyle}>Halo {guestName}, mohon konfirmasi kehadiran Anda.</p>

      {/* 1-Tap Quick Pick Buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleQuickPick("hadir")}
          disabled={isSavingQuick}
          className={
            isCyber
              ? `flex flex-col items-center justify-center p-3 rounded-xl border font-mono text-xs font-bold uppercase transition ${
                  selectedStatus === "hadir"
                    ? "bg-[#00F5D4] text-[#0C0E14] border-[#00F5D4] shadow-[0_0_10px_#00F5D4]"
                    : "border-[#00F5D4]/30 bg-[#0C0E14] text-[#F4F7FB]/80 hover:text-[#00F5D4]"
                }`
              : isGroovy
              ? `flex flex-col items-center justify-center p-3 rounded-full border-2 font-sans text-xs font-bold uppercase transition ${
                  selectedStatus === "hadir"
                    ? "bg-[#D96B27] text-white border-[#D96B27] shadow-sm scale-105"
                    : "border-[#D96B27]/30 bg-[#FDF8EE] text-[#3A2418] hover:bg-[#D96B27]/15"
                }`
              : isWabi
              ? `flex flex-col items-center justify-center p-3 rounded-md border font-serif text-xs font-medium uppercase transition ${
                  selectedStatus === "hadir"
                    ? "bg-[#2E241D] text-[#EBE5DC] border-[#2E241D]"
                    : "border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D]/80 hover:bg-[#2E241D]/10"
                }`
              : `flex flex-col items-center justify-center p-3 border-2 border-black font-mono text-xs font-black uppercase transition ${
                  selectedStatus === "hadir"
                    ? "bg-[#D8FB38] text-black shadow-[2px_2px_0_#121212]"
                    : "bg-[#F4EFEA] text-black hover:bg-[#D8FB38]"
                }`
          }
        >
          <CheckCircle2 className="w-4 h-4 mb-1" />
          <span>hadir</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickPick("ragu")}
          disabled={isSavingQuick}
          className={
            isCyber
              ? `flex flex-col items-center justify-center p-3 rounded-xl border font-mono text-xs font-bold uppercase transition ${
                  selectedStatus === "ragu"
                    ? "bg-amber-400 text-[#0C0E14] border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                    : "border-[#00F5D4]/30 bg-[#0C0E14] text-[#F4F7FB]/80 hover:text-amber-300"
                }`
              : isGroovy
              ? `flex flex-col items-center justify-center p-3 rounded-full border-2 font-sans text-xs font-bold uppercase transition ${
                  selectedStatus === "ragu"
                    ? "bg-[#D96B27] text-white border-[#D96B27] shadow-sm scale-105"
                    : "border-[#D96B27]/30 bg-[#FDF8EE] text-[#3A2418] hover:bg-[#D96B27]/15"
                }`
              : isWabi
              ? `flex flex-col items-center justify-center p-3 rounded-md border font-serif text-xs font-medium uppercase transition ${
                  selectedStatus === "ragu"
                    ? "bg-[#2E241D] text-[#EBE5DC] border-[#2E241D]"
                    : "border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D]/80 hover:bg-[#2E241D]/10"
                }`
              : `flex flex-col items-center justify-center p-3 border-2 border-black font-mono text-xs font-black uppercase transition ${
                  selectedStatus === "ragu"
                    ? "bg-amber-300 text-black shadow-[2px_2px_0_#121212]"
                    : "bg-[#F4EFEA] text-black hover:bg-amber-200"
                }`
          }
        >
          <HelpCircle className="w-4 h-4 mb-1" />
          <span>ragu</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickPick("tidak")}
          disabled={isSavingQuick}
          className={
            isCyber
              ? `flex flex-col items-center justify-center p-3 rounded-xl border font-mono text-xs font-bold uppercase transition ${
                  selectedStatus === "tidak"
                    ? "bg-rose-500 text-white border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                    : "border-[#00F5D4]/30 bg-[#0C0E14] text-[#F4F7FB]/80 hover:text-rose-400"
                }`
              : isGroovy
              ? `flex flex-col items-center justify-center p-3 rounded-full border-2 font-sans text-xs font-bold uppercase transition ${
                  selectedStatus === "tidak"
                    ? "bg-[#D96B27] text-white border-[#D96B27] shadow-sm scale-105"
                    : "border-[#D96B27]/30 bg-[#FDF8EE] text-[#3A2418] hover:bg-[#D96B27]/15"
                }`
              : isWabi
              ? `flex flex-col items-center justify-center p-3 rounded-md border font-serif text-xs font-medium uppercase transition ${
                  selectedStatus === "tidak"
                    ? "bg-[#2E241D] text-[#EBE5DC] border-[#2E241D]"
                    : "border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D]/80 hover:bg-[#2E241D]/10"
                }`
              : `flex flex-col items-center justify-center p-3 border-2 border-black font-mono text-xs font-black uppercase transition ${
                  selectedStatus === "tidak"
                    ? "bg-rose-400 text-black shadow-[2px_2px_0_#121212]"
                    : "bg-[#F4EFEA] text-black hover:bg-rose-200"
                }`
          }
        >
          <XCircle className="w-4 h-4 mb-1" />
          <span>tidak</span>
        </button>
      </div>

      {errorMessage && <p className="mt-3 text-xs font-bold uppercase text-red-600">{errorMessage}</p>}

      {/* Edit Detail / Status Info */}
      {selectedStatus && (
        <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between">
          <span className="text-xs font-bold uppercase">
            Status: <span className="capitalize">{selectedStatus === "ragu" ? "Mungkin" : selectedStatus}</span>
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold underline hover:opacity-80 uppercase"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Detail & Ucapan</span>
          </button>
        </div>
      )}

      {/* Modal RSVP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 gpu-layer">
          <div
            className={`w-full max-w-md p-6 ${
              isBrutalist
                ? "border-4 border-black bg-[#F4EFEA] text-black shadow-[8px_8px_0_#121212]"
                : isWabi
                ? "border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D] rounded-2xl shadow-xl font-serif"
                : isCyber
                ? "border border-[#00F5D4]/50 bg-[#0C0E14] text-[#F4F7FB] rounded-2xl shadow-[0_0_30px_rgba(0,245,212,0.2)] font-mono"
                : "border-3 border-[#D96B27] bg-[#FDF8EE] text-[#3A2418] rounded-3xl shadow-[6px_6px_0_#D96B27] font-sans"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/20">
              <div>
                <span className="text-xs uppercase tracking-wider opacity-70">
                  {saveSuccess ? "Berhasil!" : "Detail RSVP"}
                </span>
                <h3 className="text-lg font-bold uppercase">
                  Status:{" "}
                  <span className="capitalize text-emerald-600 font-extrabold">
                    {selectedStatus === "ragu" ? "Mungkin" : selectedStatus || "Hadir"}
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:opacity-70 text-lg font-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDetailSubmit} className="mt-4 space-y-4">
              <p className="text-xs opacity-80">
                Lengkapi jumlah tamu yang ikut serta &amp; tulis ucapan opsional untuk pasangan:
              </p>

              {selectedStatus !== "tidak" && (
                <div>
                  <label htmlFor="pax-count-input" className="block text-xs font-bold uppercase mb-1">
                    Jumlah pax
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="pax-count-input"
                      type="number"
                      min={1}
                      max={10}
                      value={paxCount}
                      onChange={(e) => setPaxCount(Number(e.target.value))}
                      className={`w-24 px-3 py-2 text-sm font-bold border outline-none ${
                        isBrutalist
                          ? "border-2 border-black bg-white"
                          : isCyber
                          ? "border-[#00F5D4]/40 bg-[#151A24] text-[#00F5D4] rounded-lg"
                          : "border-[#2E241D]/30 bg-white/80 rounded-lg"
                      }`}
                    />
                    <span className="text-xs opacity-70">orang</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="wish-message-input" className="block text-xs font-bold uppercase mb-1">
                  Ucapan
                </label>
                <textarea
                  id="wish-message-input"
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  rows={3}
                  placeholder="Tulis ucapan selamat &amp; doa terbaik..."
                  className={`w-full px-3 py-2 text-xs border outline-none ${
                    isBrutalist
                      ? "border-2 border-black bg-white"
                      : isCyber
                      ? "border-[#00F5D4]/40 bg-[#151A24] text-white rounded-lg"
                      : "border-[#2E241D]/30 bg-white/80 rounded-lg"
                  }`}
                />
              </div>

              {errorMessage && <p className="text-xs font-bold text-rose-600">{errorMessage}</p>}

              {saveSuccess && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <Sparkles className="w-4 h-4" />
                  RSVP tersimpan
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold opacity-70 hover:opacity-100 uppercase"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetail}
                  className={`px-4 py-2 text-xs font-black uppercase transition ${
                    isBrutalist
                      ? "border-2 border-black bg-[#D8FB38] text-black shadow-[3px_3px_0_#121212]"
                      : isWabi
                      ? "bg-[#2E241D] text-[#EBE5DC] rounded-lg"
                      : isCyber
                      ? "bg-[#00F5D4] text-[#0C0E14] rounded-lg shadow-[0_0_10px_#00F5D4]"
                      : "bg-[#D96B27] text-white rounded-full shadow-[2px_2px_0_#3A2418]"
                  }`}
                >
                  {isSavingDetail ? "Menyimpan..." : "Kirim RSVP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
