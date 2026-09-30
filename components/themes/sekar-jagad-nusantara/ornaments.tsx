const MAROON = "#8B2E2E";
const GOLD = "#C9A34E";

export function SekarPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="none" />
          <g stroke={MAROON} strokeWidth="1" fill="none" opacity="0.55">
            <circle cx="12" cy="12" r="7" />
            <circle cx="36" cy="36" r="7" />
            <path d="M12 5 q7 7 0 14 q-7 -7 0 -14Z" />
            <path d="M36 29 q7 7 0 14 q-7 -7 0 -14Z" />
          </g>
          <g fill={GOLD} opacity="0.7">
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="36" cy="36" r="1.6" />
          </g>
          <g stroke={GOLD} strokeWidth="1" opacity="0.6">
            <path d="M0 24 H48" />
            <path d="M24 0 V48" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function SekarCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={MAROON} strokeWidth="1.4">
        <path d="M6 6 H44 M6 6 V44" />
        <path d="M16 16 q16 0 24 12 q-14 4 -24 -12Z" />
        <path d="M34 8 q4 16 -8 26 q-8 -12 8 -26Z" />
      </g>
      <g fill="none" stroke={GOLD} strokeWidth="1.2">
        <circle cx="52" cy="22" r="6" />
        <circle cx="22" cy="52" r="6" />
        <path d="M22 70 q-8 -10 2 -18" />
      </g>
      <g fill={MAROON} opacity="0.85">
        <circle cx="52" cy="22" r="2" />
        <circle cx="22" cy="52" r="2" />
      </g>
    </svg>
  );
}

export function SekarDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden="true">
      <g fill="none" stroke={MAROON} strokeWidth="1.3">
        <path d="M8 20 H96 M144 20 H232" />
        <path d="M96 20 q12 -14 24 0 q12 14 24 0" />
      </g>
      <g fill="none" stroke={GOLD} strokeWidth="1.2">
        <circle cx="120" cy="20" r="7" />
        <path d="M120 13 v-6 M120 27 v6 M113 20 h-6 M127 20 h6" />
      </g>
      <circle cx="120" cy="20" r="2.4" fill={MAROON} />
    </svg>
  );
}
