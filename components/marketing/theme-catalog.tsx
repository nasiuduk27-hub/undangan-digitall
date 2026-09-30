"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye, Sparkles } from "lucide-react";

type Theme = {
  id: string;
  name: string;
  category: string;
  is_premium: boolean;
  preview_thumbnail_url?: string | null;
  config_json?: {
    palette?: string[];
    fontHeader?: string;
    fontBody?: string;
  };
  description?: string;
};

export function ThemeCatalog() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch("/api/themes");
        if (res.ok) {
          const data = await res.json();
          setThemes(data);
        }
      } catch {
        // Keep fallback empty or preset
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  const filteredThemes = themes.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" ||
      t.category.toLowerCase().replace(/\s+/g, "") ===
        categoryFilter.toLowerCase().replace(/\s+/g, "");

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tema" className="py-16 md:py-24 bg-white border-t border-[#e7ddd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#a9724f]">
            Katalog Desain
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#2b2420] sm:text-4xl mt-1">
            Pilih Tema Undangan Favorit
          </h2>
          <p className="mt-3 text-[#7a6f63] text-sm sm:text-base">
            Dari nuansa modern non-mainstream hingga klasik adat, temukan gaya visual yang pas dengan momen spesial Anda.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a6f63]" />
            <input
              type="text"
              placeholder="Cari tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-xs sm:text-sm text-[#2b2420] focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "Non-Mainstream", label: "Non-Mainstream" },
              { id: "Klasik-Adat", label: "Klasik / Adat" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? "bg-[#2b2420] text-white shadow-sm"
                    : "bg-[#faf7f2] border border-[#e7ddd0] text-[#7a6f63] hover:text-[#2b2420]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Grid: mobile 2 columns, desktop 4 columns */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-[#faf7f2] border border-[#e7ddd0] animate-pulse"
              />
            ))}
          </div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-16 bg-[#faf7f2] rounded-2xl border border-dashed border-[#e7ddd0]">
            <p className="text-sm text-[#7a6f63]">
              Tidak ada tema yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredThemes.map((theme) => {
              const palette = theme.config_json?.palette || ["#2b2420", "#7a6f63", "#a9724f"];
              return (
                <div
                  key={theme.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#e7ddd0] bg-[#faf7f2] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#a9724f]/50"
                >
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-3">
                      <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#e7ddd0] text-[#7a6f63] truncate">
                        {theme.category}
                      </span>
                      {theme.is_premium ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#2b2420] text-amber-300">
                          <Sparkles className="w-3 h-3" /> Premium
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Gratis
                        </span>
                      )}
                    </div>

                    {/* Thumbnail / Color Swatch */}
                    <div
                      className="relative aspect-[3/4] rounded-xl border border-[#e7ddd0] overflow-hidden flex items-center justify-center p-3 group-hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: palette[0] || "#faf7f2" }}
                    >
                      {theme.preview_thumbnail_url ? (
                        <img
                          src={theme.preview_thumbnail_url}
                          alt={`Pratinjau ${theme.name}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                          {palette.map((color, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#2b2420] mt-3">
                      {theme.name}
                    </h3>
                    {theme.description && (
                      <p className="text-xs text-[#7a6f63] mt-1 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    )}
                  </div>

                  {/* Card Footer CTA */}
                  <div className="mt-4 pt-3 border-t border-[#e7ddd0]">
                    <Link
                      href={`/tema/${theme.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#e7ddd0] text-xs font-semibold text-[#2b2420] hover:bg-[#2b2420] hover:text-white hover:border-[#2b2420] transition-all shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Pratinjau
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
