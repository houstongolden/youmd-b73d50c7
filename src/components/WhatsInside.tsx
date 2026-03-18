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
    if (colonIdx === -1) return <span className="text-foreground/35">{line}</span>;

    const key = line.slice(0, colonIdx);
    const rest = line.slice(colonIdx);
    const isIndented = key.startsWith("  ");
    const quoteMatch = rest.match(/: "(.*)"$/);

    return (
      <>
        <span className={isIndented ? "text-foreground/30" : "text-foreground/55"}>{key}</span>
        {quoteMatch ? (
          <>
            <span className="text-foreground/15">: </span>
            <span className="text-teal/90">"{quoteMatch[1]}"</span>
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
      className="glass-card rounded-2xl p-6 md:p-8 overflow-x-auto"
    >
      <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-border/30">
        <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
        <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
        <div className="w-[7px] h-[7px] rounded-full bg-foreground/8" />
        <span className="ml-3 text-foreground/20 text-[11px] font-mono">you.md</span>
      </div>
      <pre className="font-mono text-[13px] leading-[2] min-h-[260px]">
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
        <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.25em] mb-3">What's inside</p>
        <p className="text-foreground/35 text-sm mb-14">A preview of a sample you.md identity bundle.</p>
      </FadeUp>

      <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
        <div className="md:col-span-3">
          <FadeUp delay={0.1}>
            <TypewriterCode />
          </FadeUp>
        </div>
        <div className="md:col-span-2 flex flex-col gap-7 md:pt-4">
          {callouts.map((c, i) => (
            <FadeUp key={c.label} delay={0.15 + i * 0.06}>
              <div className="border-l-[2px] border-teal/25 pl-4 py-0.5">
                <h4 className="text-foreground text-[13px] font-medium mb-1 tracking-tight">{c.label}</h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhatsInside;
