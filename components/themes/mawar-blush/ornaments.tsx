const ROSE = "#E8A5A5";
const ROSE_DEEP = "#C77B7B";
const SAGE = "#8FA98F";

export function MawarCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={SAGE} strokeWidth="1.3" opacity="0.9">
        <path d="M10 8 C 34 14, 52 32, 60 58" />
        <path d="M20 10 q2 18 -6 30" />
      </g>
      <g fill={SAGE} opacity="0.85">
        <path d="M30 22 q -10 14 2 26 q 10 -14 -2 -26Z" />
        <path d="M16 40 q -12 10 -4 24 q 12 -10 4 -24Z" />
      </g>
      <g fill={ROSE} opacity="0.9">
        <circle cx="64" cy="62" r="13" />
        <circle cx="72" cy="52" r="9" />
        <circle cx="56" cy="74" r="8" />
      </g>
      <g fill="none" stroke={ROSE_DEEP} strokeWidth="1" opacity="0.8">
        <path d="M64 50 q 6 12 0 24 q -6 -12 0 -24Z" />
        <path d="M54 62 q 12 -4 20 4" />
      </g>
    </svg>
  );
}

export function MawarDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden="true">
      <g fill="none" stroke={ROSE_DEEP} strokeWidth="1.1" opacity="0.8">
        <path d="M10 22 q 30 -14 70 -4 q 40 10 80 -2 q 30 -8 70 4" />
      </g>
      <g fill={ROSE} opacity="0.9">
        <circle cx="64" cy="18" r="5" />
        <circle cx="120" cy="22" r="7" />
        <circle cx="176" cy="18" r="5" />
      </g>
      <g fill={SAGE} opacity="0.8">
        <path d="M96 24 q -8 8 0 12 q 8 -4 0 -12Z" />
        <path d="M150 16 q 8 -8 0 -12 q -8 4 0 12Z" />
      </g>
    </svg>
  );
}

export function RosePetal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1 C 20 6, 23 14, 12 23 C 1 14, 4 6, 12 1 Z"
        fill={ROSE}
        stroke={ROSE_DEEP}
        strokeWidth="0.6"
      />
    </svg>
  );
}
