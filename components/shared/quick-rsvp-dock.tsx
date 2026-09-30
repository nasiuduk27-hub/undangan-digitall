"use client";

import { useState, type RefObject } from "react";
import { Check, X, HelpCircle, CheckCircle2, XCircle, Pause, Play, Sparkles } from "lucide-react";
import { getFloralAccent } from "@/lib/theme-style";

type ThemeId = "editorial-brutalism" | "raw-wabi-sabi" | "cyber-celestial-noir" | "70s-warm-groovy";

interface QuickRsvpDockProps {
  slug: string;
  token?: string | null;
  guestName?: string | null;
  themeId?: ThemeId | string;
  initialStatus?: string | null;
  initialPax?: number;
  initialWish?: string | null;
  audioUrl?: string | null;
  audioRef?: RefObject<HTMLAudioElement | null>;
  className?: string;
  isDesktopNav?: boolean;
}

export function QuickRsvpDock({
  slug,
  token,
  guestName = "Tamu",
  themeId = "editorial-brutalism",
  initialStatus,
  initialPax = 1,
  initialWish = "",
  audioUrl,
  audioRef,
  className = "",
  isDesktopNav = false,
}: QuickRsvpDockProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(initialStatus || null);
  const [paxCount, setPaxCount] = useState<number>(initialPax || 1);
  const [wishMessage, setWishMessage] = useState<string>(initialWish || "");
  const [isSavingQuick, setIsSavingQuick] = useState<boolean>(false);
  const [isSavingDetail, setIsSavingDetail] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const floral = getFloralAccent(themeId);

  const handleAudioToggle = () => {
    const el = audioRef?.current ?? document.querySelector<HTMLAudioElement>("audio");
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    } else {
      el.pause();
      setIsPlayingAudio(false);
    }
  };

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

      // Step 2: Automatically open Detail Form Modal / Bottom Sheet
      setIsDetailOpen(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan");
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
        throw new Error(data.error || "Gagal memperbarui detail RSVP");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsDetailOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setIsSavingDetail(false);
    }
  };

  // -------------------------------------------------------------
  // THEME BUTTON RENDERERS
  // -------------------------------------------------------------
  const renderQuickButtons = () => {
    if (floral) {
      const options = [
        { status: "hadir" as const, label: "Hadir", Icon: Check },
        { status: "tidak" as const, label: "Tidak", Icon: X },
        { status: "ragu" as const, label: "Mungkin", Icon: HelpCircle },
      ];
      return (
        <div
          className="grid w-full grid-cols-3 gap-1 rounded-full p-1"
          style={{ border: `1px solid ${floral.border}`, backgroundColor: floral.surface }}
        >
          {options.map(({ status, label, Icon }) => {
            const active = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleQuickPick(status)}
                disabled={isSavingQuick}
                className="flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs transition"
                style={
                  active
                    ? { backgroundColor: floral.accent, color: floral.accentText, fontWeight: 600 }
                    : { color: floral.text, opacity: 0.85 }
                }
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    switch (themeId) {
      case "raw-wabi-sabi":
        return (
          <div className="grid grid-cols-3 divide-x divide-[#2E241D]/20 border border-[#2E241D]/30 rounded-lg bg-[#F7F0E8]/95 p-1 shadow-sm w-full">
            <button
              type="button"
              onClick={() => handleQuickPick("hadir")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 font-serif text-xs transition ${
                selectedStatus === "hadir"
                  ? "bg-[#2E241D] text-[#EBE5DC] font-medium rounded-md"
                  : "text-[#2E241D]/80 hover:text-[#2E241D] hover:bg-[#2E241D]/10"
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Hadir</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("tidak")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 font-serif text-xs transition ${
                selectedStatus === "tidak"
                  ? "bg-[#2E241D] text-[#EBE5DC] font-medium rounded-md"
                  : "text-[#2E241D]/80 hover:text-[#2E241D] hover:bg-[#2E241D]/10"
              }`}
            >
              <X className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Absen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("ragu")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 font-serif text-xs transition ${
                selectedStatus === "ragu"
                  ? "bg-[#2E241D] text-[#EBE5DC] font-medium rounded-md"
                  : "text-[#2E241D]/80 hover:text-[#2E241D] hover:bg-[#2E241D]/10"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Ragu</span>
            </button>
          </div>
        );

      case "cyber-celestial-noir":
        return (
          <div className="grid grid-cols-3 gap-1 p-1 rounded-full border border-[#00F5D4]/40 bg-[#0C0E14]/90 backdrop-blur-md shadow-[0_0_12px_rgba(0,245,212,0.25)] w-full">
            <button
              type="button"
              onClick={() => handleQuickPick("hadir")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full font-mono text-xs transition ${
                selectedStatus === "hadir"
                  ? "bg-[#00F5D4] text-[#0C0E14] font-bold shadow-[0_0_10px_#00F5D4]"
                  : "text-[#F4F7FB]/80 hover:text-[#00F5D4] hover:bg-[#00F5D4]/10"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>HADIR</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("tidak")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full font-mono text-xs transition ${
                selectedStatus === "tidak"
                  ? "bg-rose-500 text-white font-bold shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  : "text-[#F4F7FB]/80 hover:text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>ABSEN</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("ragu")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full font-mono text-xs transition ${
                selectedStatus === "ragu"
                  ? "bg-amber-400 text-[#0C0E14] font-bold shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  : "text-[#F4F7FB]/80 hover:text-amber-300 hover:bg-amber-400/10"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>RAGU</span>
            </button>
          </div>
        );

      case "70s-warm-groovy":
        return (
          <div className="grid grid-cols-3 gap-1 p-1.5 rounded-full border-2 border-[#D96B27] bg-[#FFF2D0] shadow-[3px_3px_0_#D96B27] w-full">
            <button
              type="button"
              onClick={() => handleQuickPick("hadir")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-full font-sans text-xs font-bold transition ${
                selectedStatus === "hadir"
                  ? "bg-[#D96B27] text-white shadow-sm scale-105"
                  : "text-[#3A2418] hover:bg-[#D96B27]/15"
              }`}
            >
              <span>🎉 Hadir</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("tidak")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-full font-sans text-xs font-bold transition ${
                selectedStatus === "tidak"
                  ? "bg-[#D96B27] text-white shadow-sm scale-105"
                  : "text-[#3A2418] hover:bg-[#D96B27]/15"
              }`}
            >
              <span>😢 Tidak</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("ragu")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-full font-sans text-xs font-bold transition ${
                selectedStatus === "ragu"
                  ? "bg-[#D96B27] text-white shadow-sm scale-105"
                  : "text-[#3A2418] hover:bg-[#D96B27]/15"
              }`}
            >
              <span>🤔 Mungkin</span>
            </button>
          </div>
        );

      case "editorial-brutalism":
      default:
        return (
          <div className="grid grid-cols-3 gap-1 border-2 border-black bg-white p-1 shadow-[3px_3px_0_#121212] w-full">
            <button
              type="button"
              onClick={() => handleQuickPick("hadir")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center border-2 border-black px-2.5 py-1 font-mono text-xs font-black uppercase transition ${
                selectedStatus === "hadir"
                  ? "bg-[#D8FB38] text-black shadow-[1px_1px_0_#121212]"
                  : "bg-[#F4EFEA] text-black hover:bg-[#D8FB38]"
              }`}
            >
              HADIR
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("tidak")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center border-2 border-black px-2.5 py-1 font-mono text-xs font-black uppercase transition ${
                selectedStatus === "tidak"
                  ? "bg-rose-400 text-black shadow-[1px_1px_0_#121212]"
                  : "bg-[#F4EFEA] text-black hover:bg-rose-200"
              }`}
            >
              TIDAK
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick("ragu")}
              disabled={isSavingQuick}
              className={`flex items-center justify-center border-2 border-black px-2.5 py-1 font-mono text-xs font-black uppercase transition ${
                selectedStatus === "ragu"
                  ? "bg-amber-300 text-black shadow-[1px_1px_0_#121212]"
                  : "bg-[#F4EFEA] text-black hover:bg-amber-200"
              }`}
            >
              MUNGKIN
            </button>
          </div>
        );
    }
  };

  // Render detail modal / bottom sheet
  const renderDetailModal = () => {
    if (!isDetailOpen) return null;

    const isBrutalist = themeId === "editorial-brutalism";
    const isWabi = themeId === "raw-wabi-sabi";
    const isCyber = themeId === "cyber-celestial-noir";

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div
          className={`w-full max-w-md p-6 ${
            isBrutalist
              ? "border-4 border-black bg-[#F4EFEA] text-black shadow-[8px_8px_0_#121212]"
              : isWabi
              ? "border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D] rounded-2xl shadow-xl font-serif"
              : isCyber
              ? "border border-[#00F5D4]/50 bg-[#0C0E14] text-[#F4F7FB] rounded-2xl shadow-[0_0_30px_rgba(0,245,212,0.2)] font-mono"
              : floral
              ? "rounded-3xl border shadow-lg"
              : "border-3 border-[#D96B27] bg-[#FDF8EE] text-[#3A2418] rounded-3xl shadow-[6px_6px_0_#D96B27] font-sans"
          }`}
          style={
            floral
              ? { backgroundColor: floral.surface, color: floral.text, borderColor: floral.border }
              : undefined
          }
        >
          <div className="flex items-center justify-between pb-3 border-b border-current/20">
            <div>
              <span className="text-xs uppercase tracking-wider opacity-70">
                {saveSuccess ? "Berhasil!" : "Langkah 2 dari 2"}
              </span>
              <h3 className="text-lg font-bold">
                Status:{" "}
                <span className="capitalize text-emerald-600 font-extrabold">
                  {selectedStatus === "ragu" ? "Mungkin" : selectedStatus}
                </span>{" "}
                (Tersimpan)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
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
                <label className="block text-xs font-bold uppercase mb-1">
                  Jumlah Pax Hadir:
                </label>
                <div className="flex items-center gap-3">
                  <input
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
              <label className="block text-xs font-bold uppercase mb-1">
                Pesan Ucapan &amp; Doa (Opsional):
              </label>
              <textarea
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

            {errorMessage && (
              <p className="text-xs font-bold text-rose-600">{errorMessage}</p>
            )}

            {saveSuccess && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <Sparkles className="w-4 h-4" />
                Detail RSVP &amp; Ucapan berhasil disimpan!
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-3 py-2 text-xs font-bold opacity-70 hover:opacity-100"
              >
                Nanti Saja
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
                    : floral
                    ? "rounded-full"
                    : "bg-[#D96B27] text-white rounded-full shadow-[2px_2px_0_#3A2418]"
                }`}
                style={floral ? { backgroundColor: floral.accent, color: floral.accentText } : undefined}
              >
                {isSavingDetail ? "Menyimpan..." : "Simpan Detail"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render for Desktop Top Nav
  if (isDesktopNav) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderQuickButtons()}
        {renderDetailModal()}
      </div>
    );
  }

  // Render for Mobile Floating Dock
  return (
    <>
      <div
        className={`fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between gap-2 lg:hidden ${className}`}
      >
        {/* Quick RSVP Buttons Container */}
        <div className="flex-1 py-1">
          {renderQuickButtons()}
        </div>

        {/* Audio Toggle Button */}
        {audioUrl && (
          <button
            type="button"
            onClick={handleAudioToggle}
            className={`flex-shrink-0 flex h-11 w-11 items-center justify-center transition active:scale-95 ${
              themeId === "editorial-brutalism"
                ? "border-2 border-black bg-[#D8FB38] text-black shadow-[3px_3px_0_#121212]"
                : themeId === "raw-wabi-sabi"
                ? "rounded-full border border-[#2E241D]/30 bg-[#F7F0E8] text-[#2E241D] shadow-sm"
                : themeId === "cyber-celestial-noir"
                ? "rounded-full border border-[#00F5D4] bg-[#0C0E14] text-[#00F5D4] shadow-[0_0_10px_#00F5D4]"
                : floral
                ? "rounded-full border shadow-sm"
                : "rounded-full border-2 border-[#D96B27] bg-[#FFF2D0] text-[#D96B27] shadow-[2px_2px_0_#D96B27]"
            }`}
            style={
              floral
                ? { backgroundColor: floral.accent, color: floral.accentText, borderColor: floral.border }
                : undefined
            }
            aria-label={isPlayingAudio ? "Pause Audio" : "Play Audio"}
          >
            {isPlayingAudio ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        )}
      </div>

      {renderDetailModal()}
    </>
  );
}
