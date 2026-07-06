import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="kicker">404 / not found</p>
        <h1 className="mt-3 text-5xl font-bold">Off the map.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="kicker">error / something broke</p>
        <h1 className="mt-3 text-3xl font-bold">This page didn't load.</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Roshaan Ali Shah — AI Engineer & Builder" },
      {
        name: "description",
        content:
          "Roshaan Ali Shah — AI Engineer & Builder crafting advanced AI systems, client-side RAG, and community growth. Shipped end-to-end.",
      },
      { name: "author", content: "Roshaan Ali Shah" },
      { property: "og:title", content: "Roshaan Ali Shah — AI Engineer & Builder" },
      {
        property: "og:description",
        content:
          "Roshaan Ali Shah — AI Engineer & Builder crafting advanced AI systems, client-side RAG, and community growth. Shipped end-to-end.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Roshaan Ali Shah — AI Engineer & Builder" },
      {
        name: "twitter:description",
        content:
          "Roshaan Ali Shah — AI Engineer & Builder crafting advanced AI systems, client-side RAG, and community growth. Shipped end-to-end.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=3", sizes: "180x180" },
      { rel: "icon", href: "/favicon-32x32.png?v=3", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png?v=3", type: "image/png", sizes: "16x16" },
      { rel: "manifest", href: "/site.webmanifest?v=3" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const cleanPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const canonicalUrl = `https://roshaandev.vercel.app${cleanPath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Roshaan Ali Shah",
    "alternateName": "Shani",
    "url": "https://roshaandev.vercel.app/",
    "jobTitle": "AI Engineer",
    "description": "Final-year Software Engineering student and AI engineer building RAG systems, multi-model AI assistants, and AI automation products.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Islamabad",
      "addressCountry": "PK"
    },
    "sameAs": [
      "https://github.com/ShaniOnGitHub",
      "https://linkedin.com/in/roshaan-ali-shah"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
