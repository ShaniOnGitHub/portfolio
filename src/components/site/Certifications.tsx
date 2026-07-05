function BadgeImage() {
  return (
    <div className="relative shrink-0 w-36 drop-shadow-[0_0_30px_oklch(0.68_0.19_42/0.5)]">
      <img
        src="/ibm-cert-badge.png"
        alt="IBM RAG and Agentic AI Professional Certificate Badge"
        className="w-full h-auto"
      />
    </div>
  );
}


export function Certifications() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <p className="kicker">: certified</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
        IBM RAG and Agentic AI Certified Professional.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center gap-8 rounded-2xl border border-border bg-card/50 p-8">
          <BadgeImage />
          <div>
            <p className="mono flex items-center gap-2 text-xs text-muted-foreground">
              <span className="dot-live" /> verified
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              IBM RAG and Agentic AI Certified Professional Course
            </h3>
            <p className="mono mt-1 text-xs text-muted-foreground">Issuer: Coursera × IBM</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Covers retrieval-augmented generation pipelines, agentic workflow design, and
              applied LLM orchestration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
