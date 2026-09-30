const SAGE = "#8FA37E";
const MUSTARD = "#E0B44C";
const LAVENDER = "#9B8FC0";
const CREAM = "#F7F3E8";

export function PadangCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={SAGE} strokeWidth="1.3">
        <path d="M14 10 q 6 30 22 54" />
        <path d="M30 12 q 2 30 14 50" />
        <path d="M44 20 q -2 24 6 44" />
      </g>
      <g fill={MUSTARD}>
        <g transform="translate(38 66)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="0" cy="-6" rx="3" ry="6" transform={`rotate(${a})`} />
          ))}
          <circle r="2.2" fill="#8A6D1F" />
        </g>
        <circle cx="58" cy="46" r="3.5" />
      </g>
      <g fill={LAVENDER}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={18 + i * 3} cy={22 + i * 7} rx="3.4" ry="2.4" transform={`rotate(-20 ${18 + i * 3} ${22 + i * 7})`} />
        ))}
      </g>
      <g fill="none" stroke={SAGE}>
        <path d="M20 40 q -8 2 -12 10" />
      </g>
    </svg>
  );
}

export function PadangDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden="true">
      <g fill="none" stroke={SAGE} strokeWidth="1.2">
        <path d="M8 30 q 40 -22 80 -6 q 40 16 76 -4 q 30 -14 68 0" />
      </g>
      <g fill={MUSTARD}>
        <circle cx="52" cy="20" r="5" />
        <circle cx="150" cy="24" r="4" />
        <circle cx="210" cy="18" r="4.5" />
      </g>
      <g fill={LAVENDER}>
        <ellipse cx="100" cy="18" rx="3" ry="5" transform="rotate(-15 100 18)" />
        <ellipse cx="104" cy="24" rx="3" ry="5" transform="rotate(-15 104 24)" />
      </g>
      <g fill={CREAM} stroke={SAGE} strokeWidth="0.8">
        <circle cx="180" cy="26" r="4" />
      </g>
    </svg>
  );
}

export function PadangStems({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className={className} aria-hidden="true">
      <g fill="none" stroke={SAGE} strokeWidth="2" strokeLinecap="round">
        <path className="padang-stem" d="M40 200 C 46 150, 30 120, 46 78" />
        <path className="padang-stem" d="M96 200 C 90 160, 108 130, 98 92" />
        <path className="padang-stem" d="M170 200 C 178 150, 160 120, 176 66" />
        <path className="padang-stem" d="M250 200 C 244 155, 262 125, 252 84" />
        <path className="padang-stem" d="M320 200 C 328 150, 310 122, 326 74" />
        <path className="padang-stem" d="M370 200 C 364 160, 380 132, 372 96" />
      </g>
      <g className="padang-bloom">
        <g transform="translate(46 74)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="0" cy="-8" rx="4" ry="8" transform={`rotate(${a})`} fill={MUSTARD} />
          ))}
          <circle r="3" fill="#8A6D1F" />
        </g>
        <g transform="translate(176 62)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="3.6" ry="7" transform={`rotate(${a})`} fill="#F3E3B0" />
          ))}
          <circle r="2.6" fill="#8A6D1F" />
        </g>
        <g transform="translate(326 70)" fill={LAVENDER}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={i * 4 - 8} cy={i * 5 - 10} rx="3.4" ry="2.4" />
          ))}
        </g>
        <circle cx="98" cy="90" r="5" fill={MUSTARD} />
        <circle cx="252" cy="82" r="4.5" fill="#F3E3B0" />
        <circle cx="372" cy="94" r="4" fill={LAVENDER} />
      </g>
    </svg>
  );
}
