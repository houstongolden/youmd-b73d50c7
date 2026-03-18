import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

const CliPill = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-youmd");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={handleCopy} className="cli-pill cli-glow flex items-center gap-3 px-5 py-3">
        <span className="text-mist">$</span>
        <span className="text-green font-medium">npx create-youmd</span>
        <span className="cursor-blink text-green">▌</span>
        <span className="ml-2 text-mist/40 hover:text-mist/70 transition-colors">
          {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
        </span>
      </button>
      {copied ? (
        <span className="text-green text-[11px]">copied to clipboard</span>
      ) : (
        <span className="text-mist/40 text-[11px]">
          <span className="text-cyan/60">you.md</span>/username · public or private · readable by any agent
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

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle beam glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[80%] beam-glow pointer-events-none" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-2xl"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* ASCII-art style header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-mist/30 text-[10px] mb-4 tracking-widest uppercase">v1.0.0</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground text-2xl md:text-4xl lg:text-[2.75rem] font-mono font-light mb-6 leading-[1.15] tracking-tight"
        >
          The agent internet
          <br />
          doesn't know who you are.
          <br />
          <span className="text-green">Yet.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-mist text-[13px] md:text-[14px] mb-12 max-w-lg mx-auto leading-relaxed"
        >
          One command creates your identity file — context, voice, goals — and publishes it to a URL every AI can read.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mb-10"
        >
          <CliPill />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-6 text-[12px]"
        >
          <a href="#spec" className="text-mist/40 hover:text-mist transition-colors">
            read the spec →
          </a>
          <Link to="/profiles" className="text-cyan/50 hover:text-cyan transition-colors">
            browse profiles →
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom border */}
      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  );
};

export default Hero;
