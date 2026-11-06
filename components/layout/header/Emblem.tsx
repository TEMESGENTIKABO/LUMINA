export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.6">
        <circle cx="32" cy="32" r="29" />
        <circle
          cx="32"
          cy="32"
          r="23.5"
          strokeWidth="1.3"
          strokeDasharray="2 3"
        />
      </g>
      <g fill="currentColor">
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d="M32 8 C38 15 38 23 32 30 C26 23 26 15 32 8Z"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
        {[45, 135, 225, 315].map((a) => (
          <path
            key={a}
            d="M32 17 C35 21 35 26 32 29 C29 26 29 21 32 17Z"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="3.6" />
      </g>
    </svg>
  );
}
