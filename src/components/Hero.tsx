import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";

/* ── ASCII — UFO + Beam + Avatar (orange monochrome shading) ── */
const asciiLines = [
  // UFO — classic dome + wide saucer
  { text: "                  ▄██████▄", cls: "ascii-strong" },
  { text: "               ▄████████████▄", cls: "ascii-strong" },
  { text: "          ▄▄▓▓████████████████▓▓▄▄", cls: "ascii-mid" },
  { text: "       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", cls: "ascii-mid" },
  { text: "     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒", cls: "ascii-soft" },
  { text: "       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", cls: "ascii-glow" },
  // Beam — expanding cone of particles
  { text: "                ░  ░  ░  ░  ░", cls: "ascii-glow" },
  { text: "               ░ ░ ▒ ░ ▒ ░ ░", cls: "ascii-glow" },
  { text: "              ░ ░ ░ ▒ ░ ░ ░ ░", cls: "ascii-glow" },
  { text: "             ░ ░ ▒ ░ ░ ▒ ░ ░ ░", cls: "ascii-glow" },
  { text: "            ░ ░ ░ ░ ▒ ░ ░ ░ ░ ░", cls: "ascii-glow" },
  // Person — stick figure ascending
  { text: "                   ▄██▄", cls: "ascii-strong" },
  { text: "                   █  █", cls: "ascii-strong" },
  { text: "                   ▀██▀", cls: "ascii-strong" },
  { text: "                 ▄▄████▄▄", cls: "ascii-mid" },
  { text: "                ▀▀ ████ ▀▀", cls: "ascii-soft" },
  { text: "                   ████", cls: "ascii-mid" },
  { text: "                   █  █", cls: "ascii-soft" },
  { text: "                  ██  ██", cls: "ascii-glow" },
];

/* ── Boot sequence (faster) ── */
const bootLines = [
  { text: "initializing identity...", delay: 0 },
  { text: "loading memory...", delay: 300 },
  { text: "connecting to agent network...", delay: 600 },
  { text: "status: ONLINE", delay: 900, accent: true },
];

const BootSequence = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    bootLines.forEach((line, i) => {
      setTimeout(() => setVisibleCount(i + 1), line.delay + 200);
    });
  }, []);

  return (
    <div className="text-left inline-block">
      {bootLines.slice(0, visibleCount).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`font-mono text-[11px] leading-relaxed ${line.accent ? "text-accent font-medium" : "text-muted-foreground"}`}
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
    <button onClick={handleCopy} className="cli-pill flex items-center gap-3 px-5 py-3 group">
      <span className="text-muted-foreground">$</span>
      <span className="text-accent font-medium">npx youmd init</span>
      <span className="cursor-blink text-accent">█</span>
      <span className="ml-2 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
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
        {/* Boot sequence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-10 flex justify-center"
        >
          <BootSequence />
        </motion.div>

        {/* ASCII Art */}
        <motion.pre
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-mono text-[7px] md:text-[10px] lg:text-[11px] leading-[1.3] mb-10 select-none"
        >
          {asciiLines.map((line, i) => (
            <div key={i} className={line.cls}>{line.text || "\u00A0"}</div>
          ))}
        </motion.pre>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="mb-4"
        >
          <h1 className="text-foreground text-2xl md:text-4xl font-mono font-light tracking-tight">
            YOU.MD
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.7 }}
          className="text-muted-foreground font-mono text-[13px] mb-2 leading-relaxed"
        >
          your identity file
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.8 }}
          className="text-muted-foreground font-mono text-[13px] mb-10 leading-relaxed"
        >
          for the agent internet
        </motion.p>

        {/* CLI pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 2.0 }}
          className="mb-12"
        >
          <CliPill />
        </motion.div>

        {/* Command links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
          className="flex items-center justify-center gap-8 font-mono text-[12px]"
        >
          <a href="#get-started" className="text-muted-foreground/50 hover:text-accent transition-colors duration-200">
            &gt; enter system
          </a>
          <a href="#spec" className="text-muted-foreground/50 hover:text-accent transition-colors duration-200">
            &gt; view spec
          </a>
          <a href="#" className="text-muted-foreground/50 hover:text-accent transition-colors duration-200">
            &gt; github
          </a>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  );
};

export default Hero;
