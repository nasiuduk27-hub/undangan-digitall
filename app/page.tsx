import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#faf8f5]">
      <h1 className="text-3xl font-bold tracking-tight text-[#2b2420]">
        Undangan Nikahan Digital
      </h1>
      <p className="mt-2 text-[#7a6f63] max-w-md">
        Platform undangan pernikahan digital modern, mobile-first, dan elegan.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-lg bg-[#2b2420] text-white font-medium text-sm hover:bg-[#423933] transition"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="px-5 py-2.5 rounded-lg border border-[#2b2420] text-[#2b2420] font-medium text-sm hover:bg-[#eae5df] transition"
        >
          Daftar
        </Link>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-lg bg-[#7a6f63] text-white font-medium text-sm hover:bg-[#63594e] transition"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
