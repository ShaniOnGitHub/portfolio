import { Link } from "@tanstack/react-router";

const links = [
  { num: "01", label: "Projects", href: "/#work" },
  { num: "02", label: "Work", href: "/work" },
  { num: "03", label: "About", href: "/#about" },
  { num: "04", label: "Journey", href: "/journey" },
];

export function Nav() {
  return (
    <header className="relative z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="mono text-sm font-semibold tracking-tight">
          roshaan<span className="text-ember">.</span>ali
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-ember/70">{l.num}</span> {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">

          <a
            href="https://cal.com/roshaan"
            target="_blank"
            rel="noopener noreferrer"
            className="mono rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-[0_0_0_1px_oklch(0.68_0.19_42/0.15)] transition-all hover:border-ember/50 hover:shadow-[0_0_20px_oklch(0.68_0.19_42/0.15)]"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
