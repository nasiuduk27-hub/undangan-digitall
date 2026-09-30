export function MelatiCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke="#B8860B" strokeWidth="1.2" opacity="0.8">
        <path d="M8 8 C 40 10, 70 24, 92 54" />
        <path d="M18 6 C 44 18, 62 34, 78 62" />
      </g>
      <g fill="#FFFDF8" stroke="#C9A227" strokeWidth="0.9">
        {[
          { x: 74, y: 60, r: 9 },
          { x: 88, y: 48, r: 7 },
          { x: 60, y: 74, r: 7 },
          { x: 96, y: 68, r: 6 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy={-f.r} rx={f.r * 0.42} ry={f.r} transform={`rotate(${a})`} />
            ))}
            <circle r="2.2" fill="#B8860B" stroke="none" />
          </g>
        ))}
      </g>
      <g fill="#8AA37E" opacity="0.85">
        <path d="M40 22 q 10 -12 24 -10 q -6 14 -24 10Z" />
        <path d="M26 40 q -4 -14 10 -22 q 6 14 -10 22Z" />
      </g>
    </svg>
  );
}

export function MelatiDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden="true">
      <g fill="none" stroke="#B8860B" strokeWidth="1.3">
        <path d="M8 20 C 50 20, 70 8, 120 20 C 170 32, 190 20, 232 20" />
        <path d="M40 20 q 12 -12 24 0 q -12 12 -24 0Z" />
        <path d="M176 20 q 12 -12 24 0 q -12 12 -24 0Z" />
      </g>
      <g transform="translate(120 20)" fill="#FFFDF8" stroke="#C9A227" strokeWidth="0.9">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-7" rx="3" ry="7" transform={`rotate(${a})`} />
        ))}
        <circle r="2" fill="#B8860B" stroke="none" />
      </g>
    </svg>
  );
}
