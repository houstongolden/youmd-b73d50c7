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
      <button onClick={handleCopy} className="cli-pill cli-glow flex items-center gap-3 px-7 py-4">
        <span className="text-foreground/40">$</span>
        <span className="text-foreground font-medium">npx init youmd</span>
        <span className="cursor-blink text-teal">▌</span>
        <span className="ml-2 text-foreground/40 hover:text-foreground/70 transition-colors">
          {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
        </span>
      </button>
      {copied ? (
        <span className="text-teal text-xs font-mono">Copied ✓</span>
      ) : (
        <span className="text-foreground/35 text-[11px] tracking-wide">
          <span className="font-medium text-foreground/55">you.md</span>/username · Public or private · Readable by any agent or AI search engine
        </span>
      )}
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <section className="relative min-h-[115vh] flex flex-col items-center justify-end overflow-hidden">
      {/* Hero image with parallax */}
      <motion.div className="absolute inset-0 -top-[120px]" style={{ y: parallaxY }}>
        <img
          src={heroWarm}
          alt="A figure standing in a warm beam of light"
          className="w-full h-[calc(100%+120px)] object-cover object-[center_20%]"
        />
      </motion.div>

      {/* Seamless gradient fade into sand bg */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(27 33% 91%) 0%, hsl(27 33% 91% / 0.95) 15%, hsl(27 33% 91% / 0.7) 40%, hsl(27 33% 91% / 0.3) 65%, transparent 100%)"
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center pb-14 md:pb-20 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-foreground text-3xl md:text-5xl lg:text-[4rem] font-display font-light mb-5 leading-[1.1]"
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
          className="text-foreground/45 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          One command creates your permanent identity file — context, voice, goals — and publishes it to a URL every AI can read. Claim yours before someone else does.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          className="mb-6"
        >
          <CliPill />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a href="#spec" className="text-foreground/30 text-sm hover:text-foreground/55 transition-colors duration-200">
            Read the spec →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
