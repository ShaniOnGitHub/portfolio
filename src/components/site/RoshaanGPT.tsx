import { useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const CHIPS = [
  "Who is Roshaan?",
  "What's his AI/tech stack?",
  "What has he built?",
  "What certifications does he have?",
  "How can I contact him?",
];

export function RoshaanGPT() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something broke on my end. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ask" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <p className="kicker justify-center">
          <span className="dot-live" /> ask ShanGPT
        </p>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Ask me anything.</h2>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setInput(c)}
            className="mono shrink-0 rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground transition-all hover:border-ember/50 hover:text-foreground hover:shadow-[0_0_16px_oklch(0.68_0.19_42/0.15)]"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card/70 p-2 shadow-[0_0_40px_oklch(0.68_0.19_42/0.08)] backdrop-blur"
      >
        <button
          type="button"
          disabled
          className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground/60"
          aria-label="Mic (disabled)"
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Roshaan..."
          className="mono flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {(messages.length > 0 || loading) && (
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
          {loading && (
            <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-ember/20 bg-background/60 px-4 py-2.5 text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="dot-live animate-pulse" /> ShanGPT is thinking…
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
