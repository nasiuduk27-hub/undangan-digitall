export function RsvpPlaceholder({ guestName }: { guestName?: string | null }) {
  return (
    <section id="rsvp" className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#121212]">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">
        RSVP
      </p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none">
        Konfirmasi Hadir
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-black/70">
        Form RSVP personal{guestName ? ` untuk ${guestName}` : ""} akan aktif di tahap berikutnya.
      </p>
      <button
        type="button"
        disabled
        className="mt-5 min-h-11 w-full border-2 border-black bg-[#D8FB38] px-4 py-3 font-mono text-sm font-bold uppercase text-black opacity-60"
      >
        Form RSVP segera hadir
      </button>
    </section>
  );
}
