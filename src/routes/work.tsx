import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const roles = [
  {
    title: "Co-Founder & Head of Growth",
    org: "DentraFlow",
    desc: "AI receptionist for UK dental clinics: brand, outreach, sales.",
    period: "2026–Present",
  },
  {
    title: "Co-Founder & Media Head",
    org: "FrequenzyPK",
    desc: "3 events, 700+ attendees, end-to-end production.",
    period: "2025–Present",
  },
  {
    title: "Social Media Lead",
    org: "GDG on Campus SZABIST",
    desc: "Community growth, content strategy.",
    period: "2024–Present",
  },
  {
    title: "Prompt Engineer",
    org: "Retrax",
    desc: "Engineered AI-driven prompt systems to automate content creation workflows.",
    period: "Apr 2025–Jul 2025",
  },
  {
    title: "Scriptwriter & Content Strategist",
    org: "Freelance",
    desc: "Viral TikTok scripts, high-retention hooks.",
    period: "2026–Present",
  },
];

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work: Roshaan Ali" },
      { name: "description", content: "The full path: roles, companies, and community work." },
      { property: "og:title", content: "Work: Roshaan Ali" },
      {
        property: "og:description",
        content: "The full path: roles, companies, and community work.",
      },
      { name: "twitter:title", content: "Work: Roshaan Ali" },
      {
        name: "twitter:description",
        content: "The full path: roles, companies, and community work.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <p className="kicker">: the full path</p>
        <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Work.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Roles I currently hold, and the ones that got me here.
        </p>

        <div className="mt-12 divide-y divide-border/60 border-y border-border/60">
          {roles.map((r) => (
            <div key={r.title + r.org} className="grid gap-4 py-8 md:grid-cols-[1fr_2fr_auto] md:items-start">
              <div>
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="mono text-xs text-ember">{r.org}</p>
              </div>
              <p className="text-muted-foreground">{r.desc}</p>
              <p className="mono text-xs text-muted-foreground">{r.period}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
