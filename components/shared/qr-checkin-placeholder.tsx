import { QrCode } from "lucide-react";

export function QrCheckinPlaceholder() {
  return (
    <section className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">
        QR Check-in
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-black bg-white">
          <QrCode className="h-14 w-14 text-black" />
        </div>
        <p className="text-sm leading-relaxed text-black/70">
          Kode QR unik per tamu akan muncul setelah fitur guest path dan check-in aktif.
        </p>
      </div>
    </section>
  );
}
