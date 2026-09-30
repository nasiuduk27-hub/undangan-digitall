"use client";

import { useEffect, useState } from "react";
import { QrCode, X } from "lucide-react";
import { isFloralTheme } from "@/lib/theme-style";

interface QrCheckinModalProps {
  slug: string;
  token?: string | null;
  guestName?: string | null;
  themeId?: string;
}

export function QrCheckinModal({
  slug,
  token,
  guestName,
  themeId = "editorial-brutalism",
}: QrCheckinModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !token) return;
    setIsLoading(true);
    fetch(`/api/invite/${slug}/qr?to=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setQrImage(data.qr_image || "");
        setQrToken(data.qr_token || "");
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, slug, token]);

  const isBrutalist = themeId === "editorial-brutalism";
  const isWabi = themeId === "raw-wabi-sabi";
  const isCyber = themeId === "cyber-celestial-noir";
  const isFloral = isFloralTheme(themeId);

  const buttonStyle = isBrutalist
    ? "border-2 border-black bg-[#D8FB38] text-black shadow-[3px_3px_0_#121212] hover:translate-y-0.5"
    : isWabi
    ? "border border-[#2E241D]/30 bg-[#F7F0E8] text-[#2E241D] shadow-sm hover:bg-[#EBE5DC]"
    : isCyber
    ? "border border-[#00F5D4] bg-[#0C0E14] text-[#00F5D4] shadow-[0_0_10px_#00F5D4] hover:bg-[#00F5D4]/10"
    : isFloral
    ? "border border-[var(--f-border)] bg-[var(--f-accent)] text-[var(--f-accent-text)] shadow-sm hover:opacity-90"
    : "border-2 border-[#D96B27] bg-[#FFF2D0] text-[#D96B27] shadow-[2px_2px_0_#D96B27] hover:bg-[#FFE6A5]";

  const modalStyle = isBrutalist
    ? "border-4 border-black bg-white text-black shadow-[8px_8px_0_#121212]"
    : isWabi
    ? "border border-[#2E241D]/30 bg-[#F7F0E8] text-[#2E241D] rounded-2xl shadow-xl font-serif"
    : isCyber
    ? "border border-[#00F5D4]/50 bg-[#0C0E14] text-[#F4F7FB] rounded-2xl shadow-[0_0_30px_rgba(0,245,212,0.2)] font-mono"
    : isFloral
    ? "border border-[var(--f-border)] bg-[var(--f-surface)] text-[var(--f-text)] rounded-3xl shadow-xl"
    : "border-3 border-[#D96B27] bg-[#FFF2D0] text-[#3A2418] rounded-3xl shadow-[6px_6px_0_#D96B27] font-sans";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-xs font-bold uppercase transition active:scale-95 ${buttonStyle}`}
        aria-label="Buka Barcode Tamu"
      >
        <QrCode className="h-4 w-4" />
        <span>Barcode</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-sm p-6 ${modalStyle}`}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1 transition hover:opacity-70"
              aria-label="Tutup Barcode Modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest opacity-60">
                {guestName ? `Tamu: ${guestName}` : "QR Check-in"}
              </p>
              <h3 className="mt-1 text-xl font-extrabold uppercase">Barcode Masuk</h3>
              <p className="mt-1 text-xs opacity-75">Tunjukkan QR ini kepada resepsionis saat kedatangan.</p>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-current/20 bg-white p-4 text-black">
              {isLoading ? (
                <div className="flex h-56 items-center justify-center font-mono text-xs font-bold uppercase">
                  Memuat Barcode...
                </div>
              ) : qrImage ? (
                <img src={qrImage} alt="QR Check-in" className="h-56 w-56 object-contain" />
              ) : (
                <div className="flex h-56 items-center justify-center text-center font-mono text-xs text-black/60">
                  {token ? "Gagal memuat QR Code" : "QR Code hanya tersedia untuk undangan khusus tamu."}
                </div>
              )}
            </div>

            {qrToken && (
              <p className="mt-3 text-center break-all font-mono text-[10px] opacity-60">
                {qrToken}
              </p>
            )}

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`w-full py-2 text-xs font-black uppercase transition ${
                  isBrutalist
                    ? "border-2 border-black bg-[#D8FB38] text-black shadow-[2px_2px_0_#121212]"
                    : isWabi
                    ? "bg-[#2E241D] text-[#EBE5DC] rounded-lg"
                    : isCyber
                    ? "bg-[#00F5D4] text-[#0C0E14] rounded-lg shadow-[0_0_10px_#00F5D4]"
                    : isFloral
                    ? "bg-[var(--f-accent)] text-[var(--f-accent-text)] rounded-full"
                    : "bg-[#D96B27] text-white rounded-full shadow-[2px_2px_0_#3A2418]"
                }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
