import { Check } from "lucide-react";
import { journeyEntries } from "@/lib/journey-data";

function Mockup({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="mono flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-ember/70" />
      </div>
      <div className="mt-3 aspect-video rounded-lg border border-border/60 bg-gradient-to-br from-background to-secondary/60 p-4">
        <p className="mono text-xs text-ember">{title}</p>
        <p className="mono mt-1 text-[10px] text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

type JourneySectionProps = {
  /** Show the intro heading/kicker (used standalone on the /journey page). Default true. */
  showIntro?: boolean;
  /** Show a "view full build log" link at the end (used on the homepage). Default false. */
  showViewAllLink?: boolean;
  /** Max number of entries to show. Omit to show all. */
  limit?: number;
};

export function JourneySection({ showIntro = true, showViewAllLink = false, limit }: JourneySectionProps) {
  const entries = limit ? journeyEntries.slice(0, limit) : journeyEntries;

  return (
    <section id="journey" className="relative z-10 mx-auto max-w-5xl px-6 py-16">
      {showIntro && (
        <>
          <p className="kicker">— the journey</p>
          <h1 className="mt-3 text-5xl font-bold sm:text-6xl">My Build Log.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            I've gone from writing scripts and growing communities to shipping AI systems end to
            end. Here's the timeline of how that happened.
          </p>
        </>
      )}

      <div className="relative mt-16">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-ember/60 via-border to-transparent md:left-4" />
        <div className="space-y-20">
          {entries.map((e) => (
            <article key={e.year} className="relative pl-12 md:pl-16">
              <span className="absolute left-0 top-2 grid h-6 w-6 place-items-center rounded-full border border-ember/40 bg-background md:left-1">
                <span className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_var(--color-ember)]" />
              </span>
              <h2 className="text-4xl font-bold sm:text-5xl">{e.year}</h2>
              <p className="mt-4 max-w-3xl text-muted-foreground">{e.narrative}</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {e.mockups.map((m) => (
                  <Mockup key={m.title} {...m} />
                ))}
              </div>

              <ul className="mt-6 space-y-2">
                {e.achievements.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                    <span className="text-muted-foreground">{a}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {showViewAllLink && (
        <div className="mt-16 text-center">
          <a
            href="/journey"
            className="mono inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium shadow-[inset_0_0_0_1px_oklch(0.68_0.19_42/0.2)] transition-all hover:border-ember/60 hover:shadow-[0_0_30px_oklch(0.68_0.19_42/0.25)]"
          >
            View the full build log →
          </a>
        </div>
      )}
    </section>
  );
}
