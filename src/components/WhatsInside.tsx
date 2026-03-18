import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const codeLines = [
  "---",
  "schema: you-md/v1",
  "name: Alex Chen",
  "username: alexchen",
  "---",
  "",
  "# Alex Chen",
  "",
  "Product designer & founder. San Francisco.",
  "",
  "## Now",
  "",
  "- Ship v2 by March",
  "- Close seed round",
  "",
  "## Agent Preferences",
  "",
  "Tone: direct, warm, no jargon",
  "Format: bullet points over paragraphs",
  "Length: concise — max 3 paragraphs",
  "",
  "## Tools",
  "",
  "- Primary: Cursor, Claude Code",
  "- Infra: Vercel, Supabase",
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
    }, 16);
    return () => clearInterval(interval);
  }, [inView, totalChars]);

  const fullText = codeLines.join("\n");
  const visibleText = fullText.slice(0, visibleChars);
  const lines = visibleText.split("\n");

  const renderLine = (line: string) => {
    if (line === "---") return <span className="text-muted-foreground/25">{line}</span>;
    if (line === "") return <span>&nbsp;</span>;
    if (line.startsWith("# ")) return <span className="text-accent font-medium">{line}</span>;
    if (line.startsWith("## ")) return <span className="text-accent-700">{line}</span>;
    if (line.startsWith("- ")) return <span className="text-foreground/60">{line}</span>;

    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx);
      const val = line.slice(colonIdx);
      return (
        <>
          <span className="text-accent/70">{key}</span>
          <span className="text-muted-foreground/60">{val}</span>
        </>
      );
    }
    return <span className="text-foreground/60">{line}</span>;
  };

  return (
    <div ref={ref} className="terminal-panel overflow-x-auto">
      <div className="terminal-panel-header">
        <div className="terminal-dot" />
        <div className="terminal-dot" />
        <div className="terminal-dot" />
        <span className="ml-2 text-muted-foreground/40 text-[10px] font-mono">you.md</span>
      </div>
      <div className="p-5 md:p-6">
        <pre className="font-mono text-[12px] md:text-[13px] leading-[1.9] min-h-[260px]">
          <code>
            {lines.map((line, i) => (
              <div key={i}>{renderLine(line)}</div>
            ))}
            {visibleChars < totalChars && (
              <span className="cursor-blink text-accent">█</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

const WhatsInside = () => (
  <section id="spec" className="py-24 md:py-32">
    <div className="max-w-3xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/40 text-[10px] font-mono uppercase tracking-widest mb-2">what's inside</p>
        <p className="text-muted-foreground text-[12px] mb-14">A preview of a sample you.md identity bundle.</p>
      </FadeUp>

      <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">
        <div className="md:col-span-3">
          <FadeUp delay={0.1}>
            <TypewriterCode />
          </FadeUp>
        </div>
        <div className="md:col-span-2 flex flex-col gap-6 md:pt-4">
          {callouts.map((c, i) => (
            <FadeUp key={c.label} delay={0.15 + i * 0.06}>
              <div className="border-l-2 border-accent/20 pl-4 py-0.5">
                <h4 className="text-foreground text-[12px] font-mono font-medium mb-1">{c.label}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhatsInside;
