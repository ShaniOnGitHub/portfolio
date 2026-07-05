import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

function TerminalConsole() {
  const [lines, setLines] = useState<string[]>([]);
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
    let timer: NodeJS.Timeout;

    function type() {
      if (currentLineIdx < fullLines.length) {
        const line = fullLines[currentLineIdx];
        if (currentCharIdx <= line.length) {
          setLines(prev => {
            const copy = [...prev];
            copy[currentLineIdx] = line.slice(0, currentCharIdx);
            return copy;
          });
          
          // Batch consecutive dots to reduce re-renders and look snappier
          let increment = 1;
          if (line[currentCharIdx] === ".") {
            while (line[currentCharIdx + increment] === "." && increment < 4) {
              increment++;
            }
          }
          
          currentCharIdx += increment;
          const char = line[currentCharIdx - 1];
          const delay = char === "." ? 20 : char === " " ? 10 : 35;
          timer = setTimeout(type, delay);
        } else {
          currentLineIdx++;
          currentCharIdx = 0;
          timer = setTimeout(type, 100);
        }
      } else {
        const finalLine = "→ all layers online";
        let finalCharIdx = 0;
        
        function typeFinal() {
          if (finalCharIdx <= finalLine.length) {
            setEmberText(finalLine.slice(0, finalCharIdx));
            finalCharIdx++;
            timer = setTimeout(typeFinal, 35);
          }
        }
        timer = setTimeout(typeFinal, 100);
      }
    }

    timer = setTimeout(type, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <pre className="whitespace-pre-wrap text-xs leading-6 text-muted-foreground will-change-contents">
      {lines.map((line, idx) => (
        <div key={idx} className="transition-opacity duration-150">{line}</div>
      ))}
      <div>
        {emberText && <span className="text-ember animate-pulse-subtle">{emberText}</span>}
        <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-[1px] animate-pulse bg-ember align-middle" />
      </div>
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

        <div className="relative group">
          {/* Outer glow aura */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-ember/20 to-orange-600/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative mono overflow-hidden rounded-2xl border border-border bg-card/75 p-4 shadow-[0_20px_80px_-20px_oklch(0.68_0.19_42/0.3)] backdrop-blur-md">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-30" />
            
            {/* CRT Screen Reflection/Glass shine */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60" />
            
            <div className="relative z-10 flex items-center gap-1.5 pb-3 border-b border-border/40 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-ember/80 animate-pulse" />
              <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground/80 font-semibold">session</span>
            </div>
            <div className="relative z-10">
              <TerminalConsole />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
