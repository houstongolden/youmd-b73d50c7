import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import heroWarm from "@/assets/hero-beam.png";

const CliPill = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx init youmd");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <button onClick={handleCopy} className="cli-pill cli-glow flex items-center gap-3 px-6 py-3.5">
        <span className="text-foreground/35">$</span>
        <span className="text-foreground font-medium">npx init youmd</span>
        <span className="cursor-blink text-teal">▌</span>
        <span className="ml-1.5 text-foreground/30 hover:text-foreground/60 transition-colors">
          {copied ? <Check size={13} className="text-teal" /> : <Copy size={13} />}
        </span>
      </button>
      {copied ? (
        <span className="text-teal text-xs font-mono">Copied ✓</span>
      ) : (
        <span className="text-foreground/30 text-[11px] tracking-wide">
          <span className="font-medium text-foreground/50">you.md</span>/username · Public or private · Readable by any agent
        </span>
      )}
    </div>
  );
};

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[110vh] flex flex-col items-center justify-end overflow-hidden">
      {/* Hero image with parallax */}
      <motion.div
        className="absolute inset-0 -top-[100px]"
        style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}
      >
        <img
          src={heroWarm}
          alt="A figure standing in a warm beam of light"
          className="w-full h-[calc(100%+100px)] object-cover object-[center_18%]"
        />
      </motion.div>

      {/* Seamless gradient fade into sand bg */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(27 33% 91%) 0%, hsl(27 33% 91% / 0.97) 12%, hsl(27 33% 91% / 0.8) 35%, hsl(27 33% 91% / 0.4) 60%, hsl(27 33% 91% / 0.1) 80%, transparent 100%)"
        }}
      />

      {/* Content with counter-parallax */}
      <motion.div
        className="relative z-10 text-center pb-16 md:pb-24 px-6 max-w-3xl"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          className="text-foreground text-3xl md:text-5xl lg:text-[3.75rem] font-display font-light mb-6 leading-[1.08]"
          style={{ letterSpacing: "-0.01em" }}
        >
          The agent internet doesn't know
          <br className="hidden sm:block" />
          who you are. Yet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
          className="text-foreground/40 text-[15px] md:text-lg mb-12 max-w-md mx-auto leading-relaxed"
        >
          One command creates your permanent identity file — context, voice, goals — and publishes it to a URL every AI can read.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          className="mb-8"
        >
          <CliPill />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a href="#spec" className="text-foreground/25 text-[13px] hover:text-foreground/50 transition-colors duration-300">
            Read the spec →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
