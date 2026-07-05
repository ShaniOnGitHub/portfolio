import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Msg = { role: "user" | "assistant"; content: string };

type KnowledgeChunk = {
  question: string;
  answer: string;
  vector: number[];
};

// ─── Constants ────────────────────────────────────────────────────────────────
const SIMILARITY_THRESHOLD = 0.45;

const FALLBACK =
  "I don't have specific information on that. Try one of the suggested questions above, or reach out directly at roshaanali128@gmail.com.";

const CHIPS = [
  "Who is Shani?",
  "What's his AI/tech stack?",
  "What has he built?",
  "What certifications does he have?",
  "How can I contact him?",
];

// ─── Cosine similarity ────────────────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Module-level singletons (persist across renders) ─────────────────────────
let _extractor: ((texts: string | string[], opts?: Record<string, unknown>) => Promise<{ tolist?: () => number[][], data: Float32Array, dims: number[] }>) | null = null;
let _index: KnowledgeChunk[] | null = null;

async function getExtractor() {
  if (_extractor) return _extractor;
  // Dynamic import so the heavy library is only loaded when the user interacts
  const { pipeline } = await import("@xenova/transformers");
  _extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2") as typeof _extractor;
  return _extractor!;
}

async function getIndex(): Promise<KnowledgeChunk[]> {
  if (_index) return _index;
  const res = await fetch("/knowledge-index.json");
  if (!res.ok) throw new Error("Failed to load knowledge index");
  _index = await res.json();
  return _index!;
}

async function embedQuery(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor!(text, { pooling: "mean", normalize: true });
  if (output.tolist) return output.tolist()[0];
  const dim = output.dims[1];
  return Array.from(output.data.slice(0, dim));
}

function getKeywordOverlap(q: string, target: string): number {
  const qWords = new Set(q.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/).filter(w => w.length > 1));
  const targetWords = new Set(target.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/).filter(w => w.length > 1));
  let matchCount = 0;
  qWords.forEach(w => {
    if (targetWords.has(w)) matchCount++;
  });
  if (qWords.size === 0) return 0;
  return matchCount / qWords.size;
}

const GREETINGS = ["hi", "hello", "hey", "hi there", "yo", "greetings", "hello there", "hey there", "good morning", "good afternoon"];

function isGreeting(q: string): boolean {
  const clean = q.toLowerCase().replace(/[?.,!]/g, "").trim();
  return GREETINGS.includes(clean);
}

async function retrieveAnswer(query: string): Promise<string> {
  // Check for standard short greetings first to bypass embedding execution entirely
  if (isGreeting(query)) {
    return "Hi! I'm ShaniGPT — ask me anything about Shani's work, background, or projects. Try one of the suggested questions above to get started.";
  }

  const [queryVec, index] = await Promise.all([embedQuery(query), getIndex()]);

  let bestScore = -1;
  let bestAnswer = FALLBACK;

  for (const chunk of index) {
    const semantic = cosineSimilarity(queryVec, chunk.vector);
    const keyword = getKeywordOverlap(query, chunk.question);

    // Scale down keyword weight for single-word queries except standard greetings
    const qWords = query.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/).filter(w => w.length > 1);
    const isGreetingWord = qWords.some(w => GREETINGS.includes(w));
    const keywordWeight = (qWords.length >= 2 || isGreetingWord) ? 0.3 : 0.05;

    const score = semantic + keyword * keywordWeight;

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = chunk.answer;
    }
  }

  if (bestScore < SIMILARITY_THRESHOLD) return FALLBACK;
  return bestAnswer;
}

// ─── Component ────────────────────────────────────────────────────────────────
type ModelState = "idle" | "loading" | "ready" | "error";

export function ShaniGPT() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [searching, setSearching] = useState(false);
  const [modelState, setModelState] = useState<ModelState>("idle");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, searching]);

  async function warmUp() {
    if (modelState !== "idle") return;
    setModelState("loading");
    try {
      await Promise.all([getExtractor(), getIndex()]);
      setModelState("ready");
    } catch {
      setModelState("error");
    }
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || searching) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");

    // Bypassing loader/model initialization if it's a simple greeting
    if (isGreeting(q)) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Hi! I'm ShaniGPT — ask me anything about Shani's work, background, or projects. Try one of the suggested questions above to get started."
        }
      ]);
      return;
    }

    // Warm up on first interaction
    if (modelState === "idle" || modelState === "loading") {
      setModelState("loading");
    }
    setSearching(true);

    try {
      const answer = await retrieveAnswer(q);
      setModelState("ready");
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong loading the knowledge base. Please refresh and try again." },
      ]);
      setModelState("error");
    } finally {
      setSearching(false);
    }
  }

  return (
    <section id="ask" className="relative z-10 mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <p className="kicker justify-center">
          <span className="dot-live" /> Ask ShaniGPT
        </p>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Ask me anything.</h2>
        <p className="mono mt-2 text-xs text-muted-foreground/60">
          Runs 100% in your browser: all layers online.
        </p>
      </div>

      {/* Quick-prompt chips */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            disabled={searching}
            className="mono shrink-0 rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground transition-all hover:border-ember/50 hover:text-foreground hover:shadow-[0_0_16px_oklch(0.68_0.19_42/0.15)] disabled:opacity-50"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card/70 p-2 shadow-[0_0_40px_oklch(0.68_0.19_42/0.08)] backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={warmUp}
          placeholder="Ask me anything about Shani..."
          className="mono flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={searching || !input.trim()}
          className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Model loading banner */}
      {modelState === "loading" && !searching && (
        <p className="mono mt-3 text-center text-xs text-muted-foreground/60 animate-pulse">
          Loading ShaniGPT… (first-time model download, cached after this)
        </p>
      )}

      {/* Chat log */}
      {(messages.length > 0 || searching) && (
        <div
          ref={logRef}
          className="mono mt-6 max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-card/40 p-4 text-sm"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-2.5 text-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-ember/20 bg-background/60 px-4 py-2.5 text-foreground"
              }
            >
              {m.content}
            </div>
          ))}
          {searching && (
            <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-ember/20 bg-background/60 px-4 py-2.5 text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="dot-live animate-pulse" />
                {modelState === "loading" ? "Loading ShaniGPT…" : "Searching…"}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
