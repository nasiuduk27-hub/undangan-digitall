"use client";

import { useEffect, useState } from "react";

export function QrCheckinCard({ slug, token }: { slug: string; token: string }) {
  const [qrImage, setQrImage] = useState("");
  const [qrToken, setQrToken] = useState("");

  useEffect(() => {
    fetch(`/api/invite/${slug}/qr?to=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setQrImage(data.qr_image || "");
        setQrToken(data.qr_token || "");
      })
      .catch(console.error);
  }, [slug, token]);

  return (
    <section className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">QR Check-in</p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none">Tiket Masuk</h2>
      <p className="mt-3 text-sm text-black/70">Tunjukkan QR ini saat kedatangan.</p>
      <div className="mt-5 border-2 border-black bg-white p-3">
        {qrImage ? (
          <img src={qrImage} alt="QR Check-in" className="mx-auto h-64 w-64" />
        ) : (
          <div className="flex h-64 items-center justify-center font-mono text-xs font-bold uppercase text-black/50">
            Membuat QR...
          </div>
        )}
      </div>
      <p className="mt-3 break-all font-mono text-[10px] text-black/50">{qrToken}</p>
    </section>
  );
}
