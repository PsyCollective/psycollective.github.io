interface FlowerProps {
  x: number;
  y: number;
  size?: number;
}

interface BulbProps {
  x?: number;
  y?: number;
}

interface DecorativeComponentProps {
  className?: string;
}

export function DecorLeft({ className = "" }: DecorativeComponentProps) {
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden>
      <g fill="none" stroke="#2E8A84" strokeWidth="2.5" strokeLinecap="round">
        <path d="M30 190c-4-36 8-72 32-110" />
        <path d="M26 130c-10-10-18-24-20-36" />
        <path d="M48 90c-8-8-14-18-16-28" />
      </g>
      <g>
        <Flower x={24} y={150} size={34} />
        <Flower x={54} y={96} size={28} />
        <Flower x={12} y={78} size={20} />
      </g>
    </svg>
  );
}

export function DecorRight({ className = "" }: DecorativeComponentProps) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden>
      <g fill="none" stroke="#2E8A84" strokeWidth="2.5" strokeLinecap="round">
        <path d="M120 10c-18 42-24 86-18 136" />
        <path d="M110 78c10 10 26 18 36 20" />
        <path d="M92 130c12 6 22 14 30 24" />
      </g>
      <g>
        <Flower x={104} y={60} size={30} />
        <Flower x={86} y={120} size={24} />
        <Bulb x={120} y={170} />
      </g>
    </svg>
  );
}

export function Bubbles({ className = "" }: DecorativeComponentProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <circle cx="20" cy="20" r="6" fill="#2E8A84" opacity=".18" />
      <circle cx="48" cy="12" r="5" fill="#2E8A84" opacity=".18" />
      <circle cx="84" cy="28" r="7" fill="#2E8A84" opacity=".18" />
    </svg>
  );
}

export function Flower({ x, y, size = 28 }: FlowerProps) {
  const petal = size * 0.45;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r={size / 4} fill="#E56F5A" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse
          key={i}
          cx={Math.cos((i * Math.PI) / 3) * (size / 2)}
          cy={Math.sin((i * Math.PI) / 3) * (size / 2)}
          rx={petal / 2}
          ry={petal}
          fill="#F5BDAF"
          transform={`rotate(${(i * 60) + 20})`}
        />
      ))}
      <circle cx="0" cy="0" r={size / 6} fill="#2E8A84" opacity=".2" />
    </g>
  );
}

export function Bulb({ x = 0, y = 0 }: BulbProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="18" fill="#2E8A84" opacity=".9" />
      <path d="M-6 -2h12v6a6 6 0 0 1-12 0z" fill="#FFF3E4" />
      <rect x="-5" y="6" width="10" height="4" rx="2" fill="#FFF3E4" />
    </g>
  );
}

export function LeafBadge({ className = "" }: DecorativeComponentProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#1f6d69" />
      <path d="M30 58c16-20 34-24 40-24-2 12-12 32-34 38" fill="#2E8A84" />
      <path d="M36 60c10-8 20-12 28-12" stroke="#A9E0D6" strokeWidth="2" fill="none" />
    </svg>
  );
}