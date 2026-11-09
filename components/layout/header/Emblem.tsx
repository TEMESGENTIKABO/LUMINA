// Neutral media mark: a broadcast signal inside a ring. It has no tie to any
// name or religion, so it still works if the site is renamed. Colour follows
// the surrounding text colour (currentColor) in the header and footer.
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="32" cy="32" r="29" strokeWidth="2.6" />
        {/* inner signal arcs */}
        <path d="M25.57 24.34A10 10 0 0 0 25.57 39.66" strokeWidth="3" />
        <path d="M38.43 24.34A10 10 0 0 1 38.43 39.66" strokeWidth="3" />
        {/* outer signal arcs */}
        <path
          d="M20.43 18.21A18 18 0 0 0 20.43 45.79"
          strokeWidth="2.6"
          opacity=".7"
        />
        <path
          d="M43.57 18.21A18 18 0 0 1 43.57 45.79"
          strokeWidth="2.6"
          opacity=".7"
        />
      </g>
      <circle cx="32" cy="32" r="4.6" fill="currentColor" />
    </svg>
  );
}
