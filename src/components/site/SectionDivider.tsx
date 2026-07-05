export function SectionDivider() {
  return (
    <div className="relative mx-auto max-w-7xl px-6">
      <div className="relative flex items-center justify-center py-1">
        {/* Fading gradient line */}
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, oklch(0.68 0.19 42 / 0.15) 20%, oklch(0.68 0.19 42 / 0.5) 50%, oklch(0.68 0.19 42 / 0.15) 80%, transparent 100%)",
          }}
        />
        {/* Center diamond accent */}
        <span
          className="relative z-10 flex h-3 w-3 rotate-45 border border-ember/50 bg-background shadow-[0_0_10px_oklch(0.68_0.19_42/0.4)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
