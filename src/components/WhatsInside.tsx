import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const codeLines = [
  'name: "Alex Chen"',
  'role: "Product designer & founder"',
  'tone: "Direct, warm, no jargon"',
  'context: "Building a dev tool startup, Series A"',
  'preferences:',
  '  format: "Bullet points over paragraphs"',
  '  length: "Concise — never more than 3 paragraphs"',
  'goals:',
  '  current: "Ship v2 by March, close funding round"',
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
    if (colonIdx === -1) return <span className="text-sand/40">{line}</span>;

    const key = line.slice(0, colonIdx);
    const rest = line.slice(colonIdx);
    const isIndented = key.startsWith("  ");
    const quoteMatch = rest.match(/: "(.*)"$/);

    return (
      <>
        <span className={isIndented ? "text-sand/35" : "text-sand/50"}>{key}</span>
        {quoteMatch ? (
          <>
            <span className="text-sand/20">: </span>
            <span className="text-teal">"{quoteMatch[1]}"</span>
          </>
        ) : (
          <span className="text-sand/20">{rest}</span>
        )}
      </>
    );
  };

  return (
    <div ref={ref} className="bg-dusk rounded-2xl p-6 md:p-10 overflow-x-auto">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sand/8">
        <div className="w-2.5 h-2.5 rounded-full bg-sand/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-sand/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-sand/15" />
        <span className="ml-3 text-sand/25 text-xs font-mono">you.md</span>
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
  <section id="spec" className="py-24 md:py-32 bg-mauve/20">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-3">What's inside</p>
        <p className="text-muted-foreground text-sm mb-10">A preview of a sample you.md identity bundle.</p>
      </FadeUp>
      <FadeUp delay={0.1}>
        <TypewriterCode />
      </FadeUp>
    </div>
  </section>
);

export default WhatsInside;
