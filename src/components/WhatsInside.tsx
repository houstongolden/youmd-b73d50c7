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
  "",
  "## Links",
  "",
  "- Website: https://alexchen.dev",
  "- LinkedIn: /in/alexchen",
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
    if (line === "---") return <span className="text-muted-foreground/20">{line}</span>;
    if (line === "") return <span>&nbsp;</span>;
    if (line.startsWith("# ")) return <span className="text-accent">{line}</span>;
    if (line.startsWith("## ")) return <span className="text-accent/70">{line}</span>;
    if (line.startsWith("- ")) return <span className="text-foreground/60">{line}</span>;
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 20) {
      return (
        <>
          <span className="text-accent/60">{line.slice(0, colonIdx)}</span>
          <span className="text-muted-foreground/50">{line.slice(colonIdx)}</span>
        </>
      );
    }
    return <span className="text-foreground/50">{line}</span>;
  };

  return (
    <div ref={ref} className="overflow-x-auto border border-border rounded">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/10" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/10" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/10" />
        <span className="ml-2 text-muted-foreground/30 text-[10px] font-mono">you.md</span>
      </div>
      <div className="p-5">
        <pre className="font-mono text-[11px] md:text-[12px] leading-[1.9] min-h-[200px]">
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
    <div className="max-w-xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/30 text-[10px] font-mono uppercase tracking-widest mb-2">
          ── what's inside ──
        </p>
        <p className="text-muted-foreground text-[12px] mb-10">A sample identity bundle.</p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <TypewriterCode />
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { label: "Identity", desc: "Name, role, location" },
            { label: "Voice", desc: "Tone & style preferences" },
            { label: "Goals", desc: "Current focus areas" },
            { label: "Links", desc: "Verified connections" },
          ].map((item) => (
            <div key={item.label} className="py-3 border-l-2 border-accent/15 pl-3">
              <p className="text-foreground text-[11px] font-mono mb-0.5">{item.label}</p>
              <p className="text-muted-foreground/60 text-[10px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

export default WhatsInside;
