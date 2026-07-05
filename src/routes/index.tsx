import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { SelectedWork } from "@/components/site/SelectedWork";
import { WhatIDo } from "@/components/site/WhatIDo";
import { Certifications } from "@/components/site/Certifications";
import { Currently } from "@/components/site/Currently";
import { JourneySection } from "@/components/site/JourneySection";
import { Closing } from "@/components/site/Closing";
import { Footer } from "@/components/site/Footer";
import { SectionDivider } from "@/components/site/SectionDivider";

const LazyShaniGPT = lazy(() =>
  import("@/components/site/ShaniGPT").then((m) => ({ default: m.ShaniGPT }))
);

function ShaniGPTLazyWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Load the chunk slightly before the section is scrolled into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[250px]">
      {shouldLoad ? (
        <Suspense fallback={<div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground/60 mono">Initializing chatbot...</div>}>
          <LazyShaniGPT />
        </Suspense>
      ) : null}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      <div className="mt-16"><SectionDivider /></div>
      <ShaniGPTLazyWrapper />
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

