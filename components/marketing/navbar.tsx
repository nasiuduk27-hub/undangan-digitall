"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";

export function MarketingNavbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#e7ddd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#2b2420] text-[#faf7f2] font-serif font-bold text-lg flex items-center justify-center shadow-sm">
            U
          </span>
          <span className="font-bold text-lg text-[#2b2420] tracking-tight">
            Undanganku
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#7a6f63]">
          <a href="#tema" className="hover:text-[#2b2420] transition-colors">
            Tema
          </a>
          <a href="#fitur" className="hover:text-[#2b2420] transition-colors">
            Fitur
          </a>
          <a href="#faq" className="hover:text-[#2b2420] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2b2420] text-white text-xs font-semibold hover:bg-[#423933] transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#2b2420] hover:bg-[#eae5df] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-[#a9724f] text-white text-xs font-semibold hover:bg-[#8f5f40] transition-colors shadow-sm"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#2b2420] hover:bg-[#eae5df] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e7ddd0] bg-[#faf7f2] px-4 pt-2 pb-6 space-y-3">
          <a
            href="#tema"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#2b2420]"
          >
            Tema
          </a>
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#2b2420]"
          >
            Fitur
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#2b2420]"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-[#e7ddd0] flex flex-col gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="w-full text-center py-2.5 rounded-xl bg-[#2b2420] text-white text-xs font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-[#2b2420] text-[#2b2420] text-xs font-semibold"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-[#a9724f] text-white text-xs font-semibold"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
