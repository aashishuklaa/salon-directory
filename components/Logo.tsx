// Two files: green-and-terracotta for light pages, cream-and-terracotta for dark. CSS shows the one that fits the theme.
export function Logo({ className = 'logo', label }: { className?: string; label: string }) {
  return (
    <span className={`${className} logo-swap`}>
      <img className="logo-swap__light" src="/assets/img/trimcircle-logo-transparent.png" alt={label} />
      <img className="logo-swap__dark" src="/assets/img/trimcircle-logo-transparent-dark.png" alt="" aria-hidden="true" />
    </span>
  );
}

export function Mark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <path d="M8.1 7.6L20 18M8.1 16.4L20 6" />
    </svg>
  );
}
