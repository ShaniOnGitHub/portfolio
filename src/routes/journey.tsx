import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { JourneySection } from "@/components/site/JourneySection";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Build Log: Roshaan Ali" },
      {
        name: "description",
        content:
          "From writing scripts and growing communities to shipping AI systems end to end: the timeline.",
      },
      { property: "og:title", content: "My Build Log: Roshaan Ali" },
      {
        property: "og:description",
        content:
          "From writing scripts and growing communities to shipping AI systems end to end: the timeline.",
      },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <JourneySection />
      <Footer />
    </main>
  );
}
