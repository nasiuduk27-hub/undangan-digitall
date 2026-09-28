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

  const isCyber = themeId === "cyber-celestial-noir";
  const isGroovy = themeId === "70s-warm-groovy";
  const isWabi = themeId === "raw-wabi-sabi";

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

  const getStatusSpanStyle = (status: string) => {
    if (isCyber) {
      const activeClass =
        status === "hadir"
          ? "peer-checked:bg-[#00F5D4] peer-checked:text-[#0C0E14] peer-checked:border-[#00F5D4] peer-checked:shadow-[0_0_10px_#00F5D4]"
          : status === "ragu"
          ? "peer-checked:bg-amber-400 peer-checked:text-[#0C0E14] peer-checked:border-amber-400 peer-checked:shadow-[0_0_10px_rgba(251,191,36,0.6)]"
          : "peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 peer-checked:shadow-[0_0_10px_rgba(244,63,94,0.6)]";
      return `block border border-[#00F5D4]/30 bg-[#0C0E14] text-[#F4F7FB]/80 px-2 py-3 text-center font-mono text-xs font-bold uppercase transition rounded-xl ${activeClass}`;
    }
    if (isGroovy) {
      return "block border-2 border-[#D96B27]/30 bg-[#FDF8EE] text-[#3A2418] px-2 py-3 text-center font-sans text-xs font-bold uppercase transition rounded-full peer-checked:bg-[#D96B27] peer-checked:text-white peer-checked:border-[#D96B27] peer-checked:shadow-sm peer-checked:scale-[1.02]";
    }
    if (isWabi) {
      return "block border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D]/80 px-2 py-3 text-center font-serif text-xs uppercase transition rounded-md peer-checked:bg-[#2E241D] peer-checked:text-[#EBE5DC] peer-checked:border-[#2E241D] peer-checked:font-medium";
    }
    return "block border-2 border-black bg-[#F4EFEA] px-2 py-3 text-center font-mono text-xs font-black uppercase peer-checked:bg-[#D8FB38]";
  };

  const inputStyle = isCyber
    ? "mt-1 min-h-11 w-full border border-[#00F5D4]/40 bg-[#0C0E14] text-[#F4F7FB] px-3 font-mono text-sm rounded-xl outline-none focus:border-[#00F5D4]"
    : isGroovy
    ? "mt-1 min-h-11 w-full border-2 border-[#D96B27]/40 bg-[#FDF8EE] text-[#3A2418] px-3 font-sans font-bold text-sm rounded-2xl outline-none focus:border-[#D96B27]"
    : isWabi
    ? "mt-1 min-h-11 w-full border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D] px-3 font-serif text-sm rounded-md outline-none focus:border-[#2E241D]"
    : "mt-1 min-h-11 w-full border-2 border-black bg-[#F4EFEA] px-3 font-mono font-bold text-sm outline-none";

  const textareaStyle = isCyber
    ? "mt-1 w-full border border-[#00F5D4]/40 bg-[#0C0E14] text-[#F4F7FB] px-3 py-2 font-mono text-sm rounded-xl outline-none focus:border-[#00F5D4]"
    : isGroovy
    ? "mt-1 w-full border-2 border-[#D96B27]/40 bg-[#FDF8EE] text-[#3A2418] px-3 py-2 font-sans text-sm rounded-2xl outline-none focus:border-[#D96B27]"
    : isWabi
    ? "mt-1 w-full border border-[#2E241D]/30 bg-[#EBE5DC] text-[#2E241D] px-3 py-2 font-serif text-sm rounded-md outline-none focus:border-[#2E241D]"
    : "mt-1 w-full border-2 border-black bg-[#F4EFEA] px-3 py-2 font-mono text-sm outline-none";

  const btnStyle = isCyber
    ? "min-h-11 w-full border border-[#00F5D4] bg-[#00F5D4] text-[#0C0E14] px-4 py-3 font-mono text-sm font-bold uppercase rounded-xl shadow-[0_0_12px_rgba(0,245,212,0.4)] hover:bg-[#00e0c2] transition disabled:opacity-60"
    : isGroovy
    ? "min-h-11 w-full border-2 border-[#D96B27] bg-[#D96B27] text-white px-4 py-3 font-sans text-sm font-bold uppercase rounded-full shadow-[3px_3px_0_#3A2418] hover:bg-[#c0591b] transition disabled:opacity-60"
    : isWabi
    ? "min-h-11 w-full border border-[#2E241D] bg-[#2E241D] text-[#EBE5DC] px-4 py-3 font-serif text-sm font-medium uppercase rounded-md shadow-sm hover:bg-[#3d3027] transition disabled:opacity-60"
    : "min-h-11 w-full border-2 border-black bg-[#D8FB38] px-4 py-3 font-mono text-sm font-black uppercase shadow-[4px_4px_0_#121212] disabled:opacity-60";

  const labelHeaderStyle = isCyber
    ? "font-mono text-xs font-bold uppercase text-[#00F5D4]"
    : isGroovy
    ? "font-serif text-xs font-bold uppercase text-[#D96B27]"
    : isWabi
    ? "font-serif text-xs font-medium uppercase text-[#2E241D]/80"
    : "font-mono text-xs font-bold uppercase";

  return (
    <section id="rsvp" className={containerStyle}>
      <p className={tagStyle}>RSVP</p>
      <h2 className={titleStyle}>Konfirmasi Hadir</h2>
      <p className={subStyle}>Halo {guestName}, mohon konfirmasi kehadiran Anda.</p>

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
              <span className={getStatusSpanStyle(status)}>
                {status}
              </span>
            </label>
          ))}
        </div>

        <label className="block">
          <span className={labelHeaderStyle}>Jumlah pax</span>
          <input
            type="number"
            min={1}
            max={10}
            value={pax}
            onChange={(event) => setPax(Number(event.target.value))}
            className={inputStyle}
          />
        </label>

        <label className="block">
          <span className={labelHeaderStyle}>Ucapan</span>
          <textarea
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            rows={4}
            className={textareaStyle}
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
          className={btnStyle}
        >
          {loading ? "Menyimpan..." : "Kirim RSVP"}
        </button>
      </form>
    </section>
  );
}
