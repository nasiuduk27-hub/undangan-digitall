"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Heart,
  QrCode,
  User,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: "Undangan Saya", href: "/dashboard", icon: LayoutDashboard },
    { label: "Buat Baru", href: "/invitations/new", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between border-r border-[#e7ddd0] bg-white p-6 min-h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#a9724f] flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-[#2b2420] text-sm leading-tight block">
                Undangan Nikahan
              </span>
              <span className="text-[11px] text-[#7a6f63]">Dashboard Pengantin</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#f1e4d8] text-[#a9724f]"
                      : "text-[#7a6f63] hover:bg-[#faf7f2] hover:text-[#2b2420]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-[#e7ddd0]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#f1e4d8] text-[#a9724f] flex items-center justify-center font-bold text-sm">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-[#2b2420] truncate">
                {session?.user?.name || "Pengguna"}
              </p>
              <p className="text-xs text-[#7a6f63] truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#e7ddd0] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#a9724f] flex items-center justify-center text-white">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="font-bold text-[#2b2420] text-sm">Undangan Nikahan</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Keluar"
          className="text-[#7a6f63] hover:text-red-600 p-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e7ddd0] flex items-center justify-around py-2 px-4 z-dock shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg ${
                isActive ? "text-[#a9724f]" : "text-[#7a6f63]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
