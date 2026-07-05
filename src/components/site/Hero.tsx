import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

function TerminalConsole() {
  const [text, setText] = useState("");
  const [emberText, setEmberText] = useState("");

  useEffect(() => {
    const fullLines = [
      "$ boot --profile shani",
      "  content ............ ok",
      "  ai_engineering ..... ok",
      "  sales_gtm .......... ok",
      "  community .......... ok"
    ];

    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let currentText = "";
    let timer: NodeJS.Timeout;

    function typeChar() {
      if (currentLineIdx < fullLines.length) {
        const line = fullLines[currentLineIdx];
        if (currentCharIdx < line.length) {
          currentText += line[currentCharIdx];
          setText(currentText + (currentCharIdx === line.length - 1 ? "\n" : ""));
          currentCharIdx++;
          const char = line[currentCharIdx - 1];
          const delay = char === "." ? 10 : char === " " ? 15 : 40;
          timer = setTimeout(typeChar, delay);
        } else {
          currentLineIdx++;
          currentCharIdx = 0;
          timer = setTimeout(typeChar, 200);
        }
      } else {
        const finalLine = "→ all layers online";
        let finalCharIdx = 0;
        let finalOutput = "";
        
        function typeFinal() {
          if (finalCharIdx < finalLine.length) {
            finalOutput += finalLine[finalCharIdx];
            setEmberText(finalOutput);
            finalCharIdx++;
            timer = setTimeout(typeFinal, 55);
          }
        }
        typeFinal();
      }
    }

    timer = setTimeout(typeChar, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <pre className="whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
      {text}
      {emberText && <span className="text-ember">{emberText}</span>}
      <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-[1px] animate-pulse bg-ember align-middle" />
    </pre>
  );
}

export function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-4 pb-6 sm:pt-6 sm:pb-10">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="kicker">
            <span className="dot-live" /> Open to new opportunities
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-5xl">
            Most engineers<br />
            can <span className="ember-text">build</span>.<br />
            Most marketers<br />
            can <span className="ember-text">sell</span>.<br />
            I do both.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            I move between two worlds: content and code. I help scale personal brands and grow communities,
            and I build AI systems that actually ship. Give me a brand to grow or a problem to
            automate, and I'll <span className="text-foreground">own it end to end</span>.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="mono inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium shadow-[inset_0_0_0_1px_oklch(0.68_0.19_42/0.2)] transition-all hover:border-ember/60 hover:shadow-[0_0_30px_oklch(0.68_0.19_42/0.25)]"
            >
              See the work →
            </a>
            <a
              href="/Roshaan_Ali_Shah_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Résumé ↗
            </a>
          </div>
          <p className="kicker mt-5">
            <MapPin className="h-3 w-3 text-ember" /> Islamabad, Pakistan
          </p>
        </div>

        <div className="relative">
          <div className="mono rounded-2xl border border-border bg-card/70 p-4 shadow-[0_20px_80px_-20px_oklch(0.68_0.19_42/0.35)] backdrop-blur">
            <div className="flex items-center gap-1.5 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-ember" />
              <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground">session</span>
            </div>
            <TerminalConsole />
          </div>
        </div>
      </div>
    </section>
  );
}
