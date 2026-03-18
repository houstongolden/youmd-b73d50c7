import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import heroWarm from "@/assets/hero-beam.png";

const CliPill = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx init youmd");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={handleCopy} className="cli-pill cli-glow flex items-center gap-3 px-6 py-3.5">
        <span className="text-foreground/50">$</span>
        <span className="text-foreground">npx init youmd</span>
        <span className="cursor-blink text-teal">▌</span>
        <span className="ml-2 text-foreground/40 hover:text-foreground/70 transition-colors">
          {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
        </span>
      </button>
      {copied ? (
        <span className="text-teal text-xs font-mono">Copied ✓</span>
      ) : (
        <span className="text-foreground/30 text-[11px] tracking-wide">
          Claims your username · Builds your bundle · Publishes in 60 seconds
        </span>
      )}
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 80]);

  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-end overflow-hidden">
      {/* Hero image — warm only */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <img
          src={heroWarm}
          alt="A figure standing in a warm beam of light"
          className="w-full h-full object-cover object-[center_30%]"
        />
      </motion.div>

      {/* Soft warm gradient at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background: "linear-gradient(to top, hsl(27 33% 91% / 0.85) 0%, hsl(27 33% 91% / 0.5) 35%, transparent 100%)"
        }}
      />

      {/* Content — below the figure */}
      <div className="relative z-10 text-center pb-12 md:pb-16 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-foreground text-4xl md:text-6xl lg:text-[4.5rem] font-display font-light mb-5 leading-[1.08]"
          style={{ letterSpacing: "0.01em" }}
        >
          The agent internet doesn't know
          <br />
          who you are. Yet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
          className="text-foreground/50 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          You.md is a structured identity bundle — context, preferences, voice, and goals — that travels with you across every AI interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          className="mb-5"
        >
          <CliPill />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a href="#spec" className="text-foreground/35 text-sm hover:text-foreground/55 transition-colors duration-200">
            Read the spec →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
