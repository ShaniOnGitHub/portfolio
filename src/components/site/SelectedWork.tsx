type Project = {
  name: string;
  year: string;
  desc: string;
  url?: string;
  mockup: React.ReactNode;
};

function BrowserFrame({ url, children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-3">
      <div className="mono flex items-center gap-1.5 pb-2 text-[10px] text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 truncate">{url ?? ""}</span>
      </div>
      <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br from-background to-card">
        {children}
      </div>
    </div>
  );
}

const projects: Project[] = [
  {
    name: "SmartExam",
    year: "2025",
    url: "smartexam.app",
    desc: "AI-assisted online exam proctoring platform: student portal & notifications.",
    mockup: (
      <div className="mono flex h-full flex-col p-3 text-[10px]">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <span className="font-semibold">Exam: CS-401</span>
          <span className="text-ember">● proctoring</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1.5 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded bg-secondary p-1.5">
              Q{i + 1}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "DentraFlow",
    year: "2026",
    url: "dentraflow.com",
    desc: "AI receptionist for UK dental clinics: inbound calls handled 24/7.",
    mockup: (
      <div className="mono h-full p-3 text-[10px]">
        <div className="font-semibold">Today's calls</div>
        <div className="mt-2 space-y-1.5">
          {["Booked · 10:15", "Booked · 11:40", "Callback · 14:00", "Cancelled · 15:30"].map((t) => (
            <div key={t} className="flex items-center justify-between rounded border border-border px-2 py-1">
              <span>{t}</span>
              <span className="text-ember">●</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Support Automation",
    year: "Early 2025",
    url: "internal",
    desc: "Multi-tenant AI support system: FastAPI, pgvector, Gemini.",
    mockup: (
      <div className="mono flex h-full flex-col p-3 text-[10px]">
        <div className="font-semibold">Tenants</div>
        <div className="mt-2 grid flex-1 grid-cols-2 gap-1.5">
          {["acme", "orbit", "novara", "helix"].map((t) => (
            <div key={t} className="rounded border border-border p-1.5">
              <div>{t}</div>
              <div className="text-ember">99.8% ↑</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function SelectedWork() {
  return (
    <section id="work" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">: selected work</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Things people actually use.</h2>
        </div>
        <a href="/work" className="mono text-sm text-muted-foreground hover:text-foreground">
          All projects ↗
        </a>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.name}
            className="group rounded-2xl border border-border bg-card/50 p-4 transition-all hover:border-ember/40 hover:shadow-[0_0_40px_-10px_oklch(0.68_0.19_42/0.35)]"
          >
            <BrowserFrame url={p.url}>{p.mockup}</BrowserFrame>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-base font-semibold">{p.name}</h3>
              <span className="mono text-xs text-muted-foreground">{p.year}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <p className="mono mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="dot-live" /> Actively maintained
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
