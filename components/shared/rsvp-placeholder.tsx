import { isFloralTheme } from "@/lib/theme-style";

export function RsvpPlaceholder({
  guestName,
  themeId = "editorial-brutalism",
}: {
  guestName?: string | null;
  themeId?: string;
}) {
  const isCyber = themeId === "cyber-celestial-noir";
  const isGroovy = themeId === "70s-warm-groovy";
  const isWabi = themeId === "raw-wabi-sabi";
  const isFloral = isFloralTheme(themeId);

  const containerStyle = isCyber
    ? "border border-[#00F5D4]/40 bg-[#151A24] p-5 lg:p-6 text-[#F4F7FB] rounded-2xl shadow-[0_0_20px_rgba(0,245,212,0.15)] font-mono"
    : isGroovy
    ? "border-2 border-[#D96B27] bg-[#FFF2D0] p-5 lg:p-6 text-[#3A2418] rounded-3xl shadow-[5px_5px_0_#D96B27] font-sans"
    : isWabi
    ? "border border-[#2E241D]/30 bg-[#F7F0E8] p-5 lg:p-6 text-[#2E241D] rounded-xl shadow-sm font-serif"
    : isFloral
    ? "border border-[var(--f-border)] bg-[var(--f-surface)] p-5 lg:p-6 text-[var(--f-text)] rounded-[1.75rem] shadow-sm"
    : "border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]";

  const tagStyle = isCyber
    ? "font-mono text-xs uppercase tracking-[0.2em] text-[#00F5D4]"
    : isGroovy
    ? "font-serif text-xs font-bold uppercase tracking-wider text-[#D96B27]"
    : isWabi
    ? "font-serif text-xs uppercase tracking-widest text-[#2E241D]/60"
    : isFloral
    ? "text-xs italic uppercase tracking-[0.3em] text-[var(--f-accent-strong)]"
    : "font-mono text-xs uppercase tracking-[0.2em] text-black/60";

  const titleStyle = isCyber
    ? "mt-2 text-2xl font-bold uppercase leading-none tracking-wide text-[#F4F7FB]"
    : isGroovy
    ? "mt-2 font-serif text-2xl font-bold uppercase leading-none text-[#D96B27]"
    : isWabi
    ? "mt-2 font-serif text-2xl font-normal uppercase leading-none text-[#2E241D]"
    : isFloral
    ? "mt-2 text-2xl leading-none text-[var(--f-text)]"
    : "mt-2 text-2xl font-black uppercase leading-none";

  const subStyle = isCyber
    ? "mt-3 text-sm leading-relaxed text-[#F4F7FB]/70 font-mono"
    : isGroovy
    ? "mt-3 text-sm leading-relaxed text-[#3A2418]/80 font-sans"
    : isWabi
    ? "mt-3 text-sm leading-relaxed text-[#2E241D]/80 font-serif"
    : isFloral
    ? "mt-3 text-sm leading-relaxed text-[var(--f-muted)]"
    : "mt-3 text-sm leading-relaxed text-black/70";

  const btnStyle = isCyber
    ? "mt-5 min-h-11 w-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 text-[#00F5D4] px-4 py-3 font-mono text-sm font-bold uppercase rounded-xl opacity-60"
    : isGroovy
    ? "mt-5 min-h-11 w-full border-2 border-[#D96B27] bg-[#D96B27] text-white px-4 py-3 font-sans text-sm font-bold uppercase rounded-full opacity-60"
    : isWabi
    ? "mt-5 min-h-11 w-full border border-[#2E241D]/30 bg-[#2E241D]/20 text-[#2E241D] px-4 py-3 font-serif text-sm font-medium uppercase rounded-md opacity-60"
    : isFloral
    ? "mt-5 min-h-11 w-full border border-[var(--f-border)] bg-[var(--f-accent)] text-[var(--f-accent-text)] px-4 py-3 text-sm font-semibold rounded-full opacity-60"
    : "mt-5 min-h-11 w-full border-2 border-black bg-[#D8FB38] px-4 py-3 font-mono text-sm font-bold uppercase text-black opacity-60";

  return (
    <section id="rsvp" className={containerStyle}>
      <p className={tagStyle}>RSVP</p>
      <h2 className={titleStyle}>Konfirmasi Hadir</h2>
      <p className={subStyle}>
        Form RSVP personal{guestName ? ` untuk ${guestName}` : ""} akan aktif di tahap berikutnya.
      </p>
      <button type="button" disabled className={btnStyle}>
        Form RSVP segera hadir
      </button>
    </section>
  );
}
