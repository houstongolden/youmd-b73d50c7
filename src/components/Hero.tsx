import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

/* ── ASCII Art ── */
const asciiLines = [
  { text: "              █████████████████████", cls: "ascii-strong" },
  { text: "         █████████████████████████████", cls: "ascii-strong" },
  { text: "       █████████████████████████████████", cls: "ascii-strong" },
  { text: "      ███████████████████████████████████", cls: "ascii-strong" },
  { text: "       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", cls: "ascii-mid" },
  { text: "          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒", cls: "ascii-soft" },
  { text: "             ░░░░░░░░░░░░░░░░░░░░", cls: "ascii-glow" },
  { text: "", cls: "" },
  { text: "                  ╲░░░░░░░░░░░╱", cls: "ascii-glow" },
  { text: "                   ╲░░░░░░░░░╱", cls: "ascii-glow" },
  { text: "                   │░░░░░░░░░│", cls: "ascii-glow" },
  { text: "                   │░░▒▒▒▒░░░│", cls: "ascii-soft" },
  { text: "                   │░▒████▒░░│", cls: "ascii-mid" },
  { text: "                   │░█    █░░│", cls: "ascii-strong" },
  { text: "                   │░█ ██ █░░│", cls: "ascii-strong" },
  { text: "                   │░█ ██ █░░│", cls: "ascii-strong" },
  { text: "                   │░█____█░░│", cls: "ascii-strong" },
  { text: "                   │░░ ░░ ░░░│", cls: "ascii-glow" },
];

/* ── Boot sequence ── */
const bootLines = [
  { text: "initializing identity...", delay: 0 },
  { text: "loading memory...", delay: 600 },
  { text: "connecting to agent network...", delay: 1200 },
  { text: "status: ONLINE", delay: 1800, accent: true },
];

const BootSequence = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    bootLines.forEach((line, i) => {
      setTimeout(() => setVisibleCount(i + 1), line.delay + 400);
    });
  }, []);

  return (
    <div className="text-left inline-block">
      {bootLines.slice(0, visibleCount).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[11px] leading-relaxed ${line.accent ? "text-accent font-medium" : "text-muted-foreground"}`}
        >
          {line.accent ? `› ${line.text}` : `  ${line.text}`}
        </motion.div>
      ))}
    </div>
  );
};

const CliPill = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("npx youmd init");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="cli-pill flex items-center gap-3 px-5 py-3">
      <span className="text-muted-foreground">$</span>
      <span className="text-accent font-medium">npx youmd init</span>
      <span className="cursor-blink text-accent">█</span>
      <span className="ml-2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
        {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
      </span>
    </button>
  );
};

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Beam glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[80%] beam-glow pointer-events-none" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-2xl"
        style={{ opacity: contentOpacity }}
      >
        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground/40 text-[10px] mb-6 tracking-widest uppercase"
        >
          v1.0.0
        </motion.p>

        {/* Boot sequence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <BootSequence />
        </motion.div>

        {/* ASCII Art */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="text-[8px] md:text-[10px] lg:text-[11px] leading-[1.3] mb-8 select-none"
        >
          {asciiLines.map((line, i) => (
            <div key={i} className={line.cls}>{line.text || "\u00A0"}</div>
          ))}
        </motion.pre>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.8 }}
          className="mb-3"
        >
          <h1 className="text-foreground text-2xl md:text-4xl font-mono font-light tracking-tight">
            YOU.MD
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.0 }}
          className="text-muted-foreground text-[13px] mb-3"
        >
          your identity file for the agent internet
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.2 }}
          className="text-muted-foreground/50 text-[11px] mb-10"
        >
          agent.md + memory.md + context.md → <span className="text-accent">you.md</span>
        </motion.p>

        {/* CLI pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 3.4 }}
          className="mb-10"
        >
          <CliPill />
        </motion.div>

        {/* Command links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.6 }}
          className="flex items-center justify-center gap-6 text-[12px]"
        >
          <a href="#spec" className="text-muted-foreground/50 hover:text-accent transition-colors">
            &gt; docs
          </a>
          <Link to="/profiles" className="text-muted-foreground/50 hover:text-accent transition-colors">
            &gt; profiles
          </Link>
          <a href="#" className="text-muted-foreground/50 hover:text-accent transition-colors">
            &gt; github
          </a>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  );
};

export default Hero;
