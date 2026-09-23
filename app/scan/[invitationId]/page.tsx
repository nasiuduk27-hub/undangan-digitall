"use client";

import { use, useState } from "react";

type VerifyResult = {
  status: "valid" | "sudah-dipakai" | "tidak-valid";
  guest_name?: string;
};

export default function ScanPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = use(params);
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(0);

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!qrToken.trim()) return;
    setLoading(true);

    const res = await fetch("/api/checkin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_token: qrToken.trim(),
        invitation_id: invitationId,
        checked_in_by: `scanner:${invitationId}`,
      }),
    });
    const data = await res.json();
    setResult(data);
    if (data.status === "valid") setCheckedInCount((count) => count + 1);
    setQrToken("");
    setLoading(false);
  };

  const resultClass =
    result?.status === "valid"
      ? "bg-green-500 text-white"
      : result?.status === "sudah-dipakai"
        ? "bg-yellow-400 text-black"
        : result
          ? "bg-red-600 text-white"
          : "bg-white text-black";

  return (
    <main className="min-h-screen bg-black p-4 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-xl flex-col justify-between rounded-3xl border border-white/15 bg-[#111] p-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Scanner Resepsionis</p>
          <h1 className="mt-2 text-3xl font-black uppercase">QR Check-in</h1>
          <p className="mt-1 text-sm text-white/60">MVP scanner: tempel hasil scan / QR token dari kartu tamu.</p>

          <div className={`mt-6 rounded-2xl p-6 text-center ${resultClass}`}>
            <p className="text-sm font-bold uppercase tracking-wider">Status</p>
            <p className="mt-2 text-4xl font-black uppercase">
              {result?.status || "Menunggu"}
            </p>
            {result?.guest_name && <p className="mt-2 text-lg font-bold">{result.guest_name}</p>}
          </div>
        </div>

        <form onSubmit={verify} className="mt-6 space-y-4">
          <textarea
            value={qrToken}
            onChange={(event) => setQrToken(event.target.value)}
            rows={6}
            placeholder="Paste QR token / hasil scan di sini"
            className="w-full rounded-2xl border border-white/15 bg-black p-4 font-mono text-sm text-white outline-none focus:border-white"
          />
          <button
            disabled={loading}
            className="min-h-12 w-full rounded-2xl bg-white px-4 py-3 font-black uppercase text-black disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Verifikasi Check-in"}
          </button>
          <p className="text-center font-mono text-xs uppercase text-white/50">
            Check-in valid sesi ini: {checkedInCount}
          </p>
        </form>
      </div>
    </main>
  );
}
