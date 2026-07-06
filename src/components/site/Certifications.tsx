function BadgeImage() {
  return (
    <div className="relative shrink-0 w-full max-w-[160px] sm:max-w-[200px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_40px_oklch(0.68_0.19_42/0.15)] transition-all duration-300 hover:border-ember/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_40px_oklch(0.68_0.19_42/0.3)]">
      <img
        src="/ibm-cert-badge.png"
        alt="IBM RAG and Agentic AI Professional Certificate Badge"
        className="block w-full h-auto object-contain"
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
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
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
