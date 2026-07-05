import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are ShanGPT, an assistant embedded in Roshaan Ali Shah's portfolio site. Answer questions about him accurately, in a friendly, concise, confident tone — 2-4 sentences per answer unless asked for detail. Never make up information not listed below.

ABOUT: Applied AI Engineer and final-year Software Engineering student at SZABIST Islamabad, combining generative AI integration expertise with B2B sales and go-to-market experience. Based in Islamabad, Pakistan.

WORK:
- Co-Founder, DentraFlow (Feb 2026–Present) — AI receptionist product for UK dental clinics. Spearheaded B2B outbound sales strategy, architected the go-to-market strategy, and directed digital presence and lead generation pipelines.
- Prompt Engineer, Retrax (Apr 2025–Jul 2025) — Engineered AI-driven prompt systems to automate content creation workflows, reducing manual design cycles through structured prompt templates.
- Co-Founder & Media Head, FrequenzyPK (2025–Present) — Islamabad-based events company; orchestrated end-to-end operations for 3 large-scale events, scaling attendance to 700+ participants.
- Social Media Lead, GDG on Campus SZABIST (2024–Present) — Managed schedules for technical workshops and community engagements, and analyzed engagement analytics to grow community reach and retention.
- Final-year project: SmartExam, an AI-assisted online exam proctoring platform. Owns the Student Portal and Notifications modules. Completed FYP-I Final Defense.

PROJECTS:
- SmartExam — AI-assisted online exam proctoring platform, student portal & notifications.
- DentraFlow — AI receptionist for UK dental clinics, handling inbound calls 24/7.
- Support Automation System — multi-tenant AI support system built with FastAPI and PostgreSQL (JWT auth, RBAC), with a RAG pipeline grounding Gemini-generated ticket replies in company knowledge docs, and an agentic triage-to-approval workflow validated by 68 automated tests on SQLite and PostgreSQL.

SKILLS: AI engineering (RAG pipelines, LLM orchestration, FastAPI, PostgreSQL/pgvector), creative content strategy (scriptwriting, viral short-form content, community growth past 1,000 members organically), and sales/GTM (cold outreach, objection handling, client acquisition). Also: content strategy, social media management, community building, influencer marketing.

EDUCATION: Bachelor's degree in Software Engineering, SZABIST University Islamabad (2027), GPA 3.37/4.

CERTIFICATIONS: IBM RAG and Agentic AI Certified Professional Course — covers retrieval-augmented generation pipelines, agentic workflow design, and applied LLM orchestration.

CONTACT: Email roshaanali128@gmail.com, GitHub github.com/ShaniOnGitHub, LinkedIn linkedin.com/in/roshaan-ali-shah.

If asked something outside this scope, politely redirect: "I can only answer questions about Roshaan's work and background — try one of the suggested questions above!"`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }
        let body: { messages: { role: "user" | "assistant"; content: string }[] };
        try {
          body = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const msgs = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...msgs.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (res.status === 429) {
            return Response.json(
              { reply: "I'm getting a lot of questions right now — try again in a moment." },
              { status: 200 },
            );
          }
          if (res.status === 402) {
            return Response.json(
              { reply: "AI credits ran out. Ping Roshaan directly at roshaanali128@gmail.com." },
              { status: 200 },
            );
          }
          return new Response(text, { status: 500 });
        }

        const data = await res.json();
        const reply =
          data?.choices?.[0]?.message?.content ??
          "Hmm, I couldn't come up with an answer for that.";
        return Response.json({ reply });
      },
    },
  },
});
