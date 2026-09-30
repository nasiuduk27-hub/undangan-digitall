const GREEN = "#1F4D3A";
const GREEN_DEEP = "#16382A";
const GOLD = "#C6A75E";

export function Orchid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true">
      <g fill="none" stroke={GREEN_DEEP} strokeWidth="1.6" opacity="0.9">
        <path d="M80 200 C 78 160, 84 136, 80 104" />
      </g>
      <g fill={GREEN_DEEP} opacity="0.9">
        <path d="M80 150 q -26 -8 -34 -34 q 30 2 34 34Z" />
        <path d="M80 132 q 26 -10 32 -36 q -28 4 -32 36Z" />
      </g>
      {/* Bunga anggrek bulan */}
      <g transform="translate(80 78)">
        {[
          { a: -90, rx: 20, ry: 34 },
          { a: -30, rx: 16, ry: 28 },
          { a: 30, rx: 16, ry: 28 },
          { a: 90, rx: 18, ry: 30 },
          { a: 150, rx: 16, ry: 28 },
          { a: 210, rx: 16, ry: 28 },
        ].map((p, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={-p.ry * 0.6}
            rx={p.rx}
            ry={p.ry}
            fill="#FFFFFF"
            stroke={GREEN}
            strokeWidth="1"
            transform={`rotate(${p.a})`}
          />
        ))}
        <circle r="9" fill={GOLD} />
        <circle r="4" fill="#8A6D2F" />
      </g>
      <g fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.8">
        <path d="M56 40 q 24 -20 48 0" />
      </g>
    </svg>
  );
}

export function AnggrekCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={GOLD} strokeWidth="1.4">
        <path d="M8 8 H52 M8 8 V52" />
        <path d="M8 24 q 20 4 30 22" />
      </g>
      <g fill={GREEN_DEEP} opacity="0.9">
        <path d="M46 30 q -18 -4 -24 -22 q 22 0 24 22Z" />
      </g>
      <g transform="translate(66 60)">
        {[
          { a: -90, ry: 20 },
          { a: -30, ry: 16 },
          { a: 30, ry: 16 },
          { a: 90, ry: 18 },
          { a: 150, ry: 16 },
          { a: 210, ry: 16 },
        ].map((p, i) => (
          <ellipse key={i} cx="0" cy={-p.ry * 0.6} rx={p.ry * 0.6} ry={p.ry} fill="#FFFFFF" stroke={GREEN} strokeWidth="1" transform={`rotate(${p.a})`} />
        ))}
        <circle r="5" fill={GOLD} />
      </g>
    </svg>
  );
}

export function AnggrekDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden="true">
      <g fill="none" stroke={GOLD} strokeWidth="1.2">
        <path d="M10 20 H100 M140 20 H230" />
      </g>
      <g transform="translate(120 20)">
        <ellipse cx="0" cy="-9" rx="4" ry="9" fill="#FFFFFF" stroke={GREEN} strokeWidth="0.9" />
        <ellipse cx="0" cy="9" rx="4" ry="9" fill="#FFFFFF" stroke={GREEN} strokeWidth="0.9" />
        <ellipse cx="-8" cy="0" rx="9" ry="4" fill="#FFFFFF" stroke={GREEN} strokeWidth="0.9" />
        <ellipse cx="8" cy="0" rx="9" ry="4" fill="#FFFFFF" stroke={GREEN} strokeWidth="0.9" />
        <circle r="3" fill={GOLD} />
      </g>
      <g fill={GREEN_DEEP} opacity="0.9">
        <path d="M176 26 q -8 8 0 10 q 8 -2 0 -10Z" />
        <path d="M64 14 q 8 -8 0 -10 q -8 2 0 10Z" />
      </g>
    </svg>
  );
}
