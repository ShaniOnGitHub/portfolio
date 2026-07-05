const items = [
  {
    n: "01",
    title: "AI Engineer",
    body: "Building multi-model AI assistants and RAG systems: from prompt design to full-stack deployment (FastAPI, PostgreSQL/pgvector, LLM integrations).",
  },
  {
    n: "02",
    title: "Creative Content Strategist",
    body: "Scriptwriting and content systems that scale: viral TikTok scripts, high-retention hooks, and content strategy for creators and brands.",
  },
  {
    n: "03",
    title: "Growth & Sales",
    body: "Full-cycle outbound: built a B2B sales pipeline from scratch for DentraFlow, including cold call scripts, objection handling, and client acquisition across the UK dental market.",
  },
  {
    n: "04",
    title: "Community Builder",
    body: "Growing engaged communities from the ground up: scaled an online community to 1,000+ members organically, and led social media strategy and audience growth for GDGoC SZABIST.",
  },
];


export function WhatIDo() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <p className="kicker">: what i do</p>
      <div className="mt-8 divide-y divide-border/60 border-y border-border/60">
        {items.map((it) => (
          <div key={it.n} className="grid gap-6 py-8 md:grid-cols-[auto_1fr_2fr] md:items-start">
            <span className="mono text-sm text-ember">{it.n}</span>
            <h3 className="text-xl font-semibold">{it.title}</h3>
            <p className="text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
