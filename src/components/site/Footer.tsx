export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="mono text-sm font-semibold">roshaan<span className="text-ember">.</span>ali</p>
            <p className="mono mt-2 text-xs text-muted-foreground">
              Software engineer & builder, Islamabad, Pakistan
            </p>
          </div>
          <div className="mono flex gap-6 text-xs text-muted-foreground md:justify-center">
            <a href="/#work" className="hover:text-foreground">Projects</a>
            <a href="/work" className="hover:text-foreground">Work</a>
            <a href="/journey" className="hover:text-foreground">Journey</a>
          </div>
          <div className="mono flex gap-4 text-xs text-muted-foreground md:justify-end">
            <a href="https://github.com/ShaniOnGitHub" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
            <a href="https://linkedin.com/in/roshaan-ali-shah" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
            <a href="mailto:roshaanali128@gmail.com" className="hover:text-foreground">Email</a>
          </div>
        </div>
        <div className="mono mt-10 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Roshaan Ali Shah</span>
          <span>Designed and built from scratch.</span>
        </div>
      </div>
    </footer>
  );
}
