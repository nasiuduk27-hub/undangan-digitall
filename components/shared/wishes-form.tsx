"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Sparkles, UserX } from "lucide-react";

interface WishesFormProps {
  slug: string;
  guestName?: string | null;
  token?: string | null;
  themeId?: string;
}

export function WishesForm({
  slug,
  guestName = "",
  token = "",
  themeId = "editorial-brutalism",
}: WishesFormProps) {
  const router = useRouter();
  const [senderName, setSenderName] = useState<string>(guestName || "");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [wishMessage, setWishMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isCyber = themeId === "cyber-celestial-noir";
  const isGroovy = themeId === "70s-warm-groovy";
  const isWabi = themeId === "raw-wabi-sabi";
  const isBrutalist = themeId === "editorial-brutalism" || (!isCyber && !isGroovy && !isWabi);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) {
      setErrorMsg("Mohon isi ucapan atau doa Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/invite/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          sender_name: isAnonymous ? "Anonim" : senderName.trim() || undefined,
          is_anonymous: isAnonymous,
          wish_message: wishMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim ucapan");
      }

      setSuccessMsg("Ucapan & doa Anda berhasil dikirim!");
      setWishMessage("");
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim ucapan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = isCyber
    ? "border border-[#00F5D4]/30 bg-[#0C0E14]/80 p-4 rounded-xl text-[#F4F7FB] font-mono shadow-[0_0_15px_rgba(0,245,212,0.1)]"
    : isGroovy
    ? "border-2 border-[#D96B27] bg-[#FFF2D0] p-4 rounded-2xl text-[#3A2418] font-sans shadow-[4px_4px_0_#D96B27]"
    : isWabi
    ? "border border-[#2E241D]/20 bg-[#F7F0E8] p-4 rounded-md text-[#2E241D] font-serif shadow-sm"
    : "border-2 border-black bg-white p-4 shadow-[4px_4px_0_#121212]";

  const inputStyle = isCyber
    ? "w-full px-3 py-2 text-xs border border-[#00F5D4]/40 bg-[#151A24] text-white rounded-lg focus:outline-none focus:border-[#00F5D4]"
    : isGroovy
    ? "w-full px-3 py-2 text-xs border-2 border-[#D96B27]/40 bg-[#FDF8EE] text-[#3A2418] rounded-xl focus:outline-none focus:border-[#D96B27]"
    : isWabi
    ? "w-full px-3 py-2 text-xs border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D] rounded-md focus:outline-none focus:border-[#2E241D]"
    : "w-full px-3 py-2 text-xs border-2 border-black bg-[#F4EFEA] text-black focus:outline-none";

  const btnStyle = isCyber
    ? "flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold uppercase rounded-lg bg-[#00F5D4] text-[#0C0E14] hover:bg-[#00F5D4]/90 shadow-[0_0_10px_#00F5D4] transition"
    : isGroovy
    ? "flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold uppercase rounded-full bg-[#D96B27] text-white hover:bg-[#C05A1D] shadow-[2px_2px_0_#3A2418] transition"
    : isWabi
    ? "flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-medium uppercase rounded-md bg-[#2E241D] text-[#EBE5DC] hover:bg-[#2E241D]/90 transition"
    : "flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-black uppercase border-2 border-black bg-[#D8FB38] text-black shadow-[3px_3px_0_#121212] hover:bg-[#c7eb22] transition";

  return (
    <form onSubmit={handleSubmit} className={cardStyle}>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
        Tulis Ucapan &amp; Doa
      </h3>

      <div className="space-y-3">
        {/* Name input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold uppercase opacity-80">
              Nama Anda
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] opacity-75 hover:opacity-100 select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <UserX className="w-3 h-3 inline" />
              <span>Kirim Anonim</span>
            </label>
          </div>
          <input
            type="text"
            value={isAnonymous ? "Anonim / Tanpa Nama" : senderName}
            onChange={(e) => setSenderName(e.target.value)}
            disabled={isAnonymous}
            placeholder="Masukkan nama Anda..."
            className={`${inputStyle} ${isAnonymous ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Wish message textarea */}
        <div>
          <label className="block text-[11px] font-bold uppercase opacity-80 mb-1">
            Pesan Ucapan
          </label>
          <textarea
            value={wishMessage}
            onChange={(e) => setWishMessage(e.target.value)}
            rows={3}
            placeholder="Tuliskan ucapan selamat &amp; doa terbaik untuk mempelai..."
            className={inputStyle}
          />
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-rose-500 uppercase">{errorMsg}</p>
        )}

        {successMsg && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <Sparkles className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={btnStyle}>
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Mengirim..." : "Kirim Ucapan"}</span>
        </button>
      </div>
    </form>
  );
}
