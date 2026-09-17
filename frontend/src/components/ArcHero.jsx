function ArcHero() {
  return (
    <svg
      className="arc-hero"
      viewBox="0 0 200 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 60 C 10 10, 190 10, 190 60"
        stroke="url(#arc-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="10" cy="60" r="5" fill="#C1503F" />
      <circle cx="100" cy="14" r="5" fill="#E8A33D" />
      <circle cx="190" cy="60" r="5" fill="#3F8F5F" />
      <defs>
        <linearGradient id="arc-gradient" x1="10" y1="60" x2="190" y2="60">
          <stop offset="0%" stopColor="#C1503F" />
          <stop offset="50%" stopColor="#E8A33D" />
          <stop offset="100%" stopColor="#3F8F5F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ArcHero;
