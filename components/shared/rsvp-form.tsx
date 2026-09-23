"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function RsvpForm({
  slug,
  token,
  guestName,
  initialStatus,
  initialPax = 1,
  initialWish = "",
}: {
  slug: string;
  token: string;
  guestName: string;
  initialStatus?: string | null;
  initialPax?: number;
  initialWish?: string | null;
}) {
  const [attendance, setAttendance] = useState(initialStatus || "hadir");
  const [pax, setPax] = useState(initialPax);
  const [wish, setWish] = useState(initialWish || "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setDone(false);
    setError("");

    try {
      const res = await fetch(`/api/invite/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          attendance_status: attendance,
          pax_count: pax,
          wish_message: wish,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan RSVP");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan RSVP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">RSVP</p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none">Konfirmasi Hadir</h2>
      <p className="mt-3 text-sm text-black/70">Halo {guestName}, mohon konfirmasi kehadiran Anda.</p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {["hadir", "ragu", "tidak"].map((status) => (
            <label key={status} className="cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value={status}
                checked={attendance === status}
                onChange={(event) => setAttendance(event.target.value)}
                className="peer sr-only"
              />
              <span className="block border-2 border-black bg-[#F4EFEA] px-2 py-3 text-center font-mono text-xs font-black uppercase peer-checked:bg-[#D8FB38]">
                {status}
              </span>
            </label>
          ))}
        </div>

        <label className="block">
          <span className="font-mono text-xs font-bold uppercase">Jumlah pax</span>
          <input
            type="number"
            min={1}
            max={10}
            value={pax}
            onChange={(event) => setPax(Number(event.target.value))}
            className="mt-1 min-h-11 w-full border-2 border-black bg-[#F4EFEA] px-3 font-mono font-bold outline-none"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs font-bold uppercase">Ucapan</span>
          <textarea
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            rows={4}
            className="mt-1 w-full border-2 border-black bg-[#F4EFEA] px-3 py-2 font-mono text-sm outline-none"
            placeholder="Tulis doa dan ucapan..."
          />
        </label>

        {error && <p className="font-mono text-xs font-bold uppercase text-red-600">{error}</p>}
        {done && (
          <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-green-700">
            <CheckCircle2 className="h-4 w-4" /> RSVP tersimpan
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full border-2 border-black bg-[#D8FB38] px-4 py-3 font-mono text-sm font-black uppercase shadow-[4px_4px_0_#121212] disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Kirim RSVP"}
        </button>
      </form>
    </section>
  );
}
