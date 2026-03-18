import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const codeLines = [
  'name: "Alex Chen"',
  'role: "Product designer & founder"',
  'location: "San Francisco"',
  'voice: "Direct, warm, no jargon"',
  'goals:',
  '  current: "Ship v2 by March"',
  '  next: "Close funding round"',
  'tools:',
  '  primary: "Cursor, Claude Code"',
  '  infra: "Vercel, Supabase"',
  'preferences:',
  '  format: "Bullet points over paragraphs"',
  '  length: "Concise — max 3 paragraphs"',
];

const callouts = [
  { label: "Identity & context", desc: "Name, role, location — the basics agents need." },
  { label: "Voice profile", desc: "Tone, style, and communication preferences." },
  { label: "Goals & priorities", desc: "What you're working on now and next." },
  { label: "Tool preferences", desc: "Your stack, so agents know what to reach for." },
];

const TypewriterCode = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = codeLines.join("\n").length;

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= totalChars) {
        setVisibleChars(totalChars);
        clearInterval(interval);
      } else {
        setVisibleChars(current);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [inView, totalChars]);

  const fullText = codeLines.join("\n");
  const visibleText = fullText.slice(0, visibleChars);
  const lines = visibleText.split("\n");

  const renderLine = (line: string) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return <span className="text-foreground/40">{line}</span>;

    const key = line.slice(0, colonIdx);
    const rest = line.slice(colonIdx);
    const isIndented = key.startsWith("  ");
    const quoteMatch = rest.match(/: "(.*)"$/);

    return (
      <>
        <span className={isIndented ? "text-foreground/30" : "text-foreground/50"}>{key}</span>
        {quoteMatch ? (
          <>
            <span className="text-foreground/15">: </span>
            <span className="text-teal">"{quoteMatch[1]}"</span>
          </>
        ) : (
          <span className="text-foreground/15">{rest}</span>
        )}
      </>
    );
  };

  return (
    <div
      ref={ref}
      className="rounded-2xl p-6 md:p-10 overflow-x-auto"
      style={{
        background: "hsl(0 0% 100% / 0.35)",
        border: "1px solid hsl(0 0% 100% / 0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.04)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-foreground/6">
        <div className="w-2 h-2 rounded-full bg-foreground/10" />
        <div className="w-2 h-2 rounded-full bg-foreground/10" />
        <div className="w-2 h-2 rounded-full bg-foreground/10" />
        <span className="ml-3 text-foreground/20 text-xs font-mono">you.md</span>
      </div>
      <pre className="font-mono text-sm leading-[2] min-h-[280px]">
        <code>
          {lines.map((line, i) => (
            <div key={i}>{renderLine(line)}</div>
          ))}
          {visibleChars < totalChars && (
            <span className="cursor-blink text-teal">▌</span>
          )}
        </code>
      </pre>
    </div>
  );
};

const WhatsInside = () => (
  <section id="spec" className="py-24 md:py-32 bg-secondary">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-[0.2em] mb-3">What's inside</p>
        <p className="text-foreground/40 text-sm mb-14">A preview of a sample you.md identity bundle.</p>
      </FadeUp>

      <div className="grid md:grid-cols-5 gap-8 md:gap-14 items-start">
        <div className="md:col-span-3">
          <FadeUp delay={0.1}>
            <TypewriterCode />
          </FadeUp>
        </div>
        <div className="md:col-span-2 flex flex-col gap-8 md:pt-6">
          {callouts.map((c, i) => (
            <FadeUp key={c.label} delay={0.15 + i * 0.05}>
              <div className="border-l-2 border-teal/30 pl-4">
                <h4 className="text-foreground text-sm font-medium mb-1">{c.label}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhatsInside;
