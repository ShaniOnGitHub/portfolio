import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ShaniGPT } from "@/components/site/ShaniGPT";
import { SelectedWork } from "@/components/site/SelectedWork";
import { WhatIDo } from "@/components/site/WhatIDo";
import { Certifications } from "@/components/site/Certifications";
import { Currently } from "@/components/site/Currently";
import { JourneySection } from "@/components/site/JourneySection";
import { Closing } from "@/components/site/Closing";
import { Footer } from "@/components/site/Footer";
import { SectionDivider } from "@/components/site/SectionDivider";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      <div className="mt-16"><SectionDivider /></div>
      <ShaniGPT />
      <SectionDivider />
      <SelectedWork />
      <SectionDivider />
      <WhatIDo />
      <SectionDivider />
      <Certifications />
      <SectionDivider />
      <Currently />
      <SectionDivider />
      <JourneySection showIntro={true} showViewAllLink={true} limit={3} />
      <SectionDivider />
      <Closing />
      <Footer />
    </main>
  );
}

