import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import heroWarm from "@/assets/hero-beam.png";
import heroCool from "@/assets/hero-beam-cool.png";

const CliPill = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx init youmd");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={handleCopy} className="cli-pill flex items-center gap-3 px-6 py-3">
        <span className="text-sand/50">$</span>
        <span className="text-sand">npx init youmd</span>
        <span className="cursor-blink text-teal">▌</span>
        <span className="ml-2 text-sand/40 hover:text-sand/70 transition-colors">
          {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
        </span>
      </button>
      {copied && (
        <span className="text-teal text-xs font-mono">Copied ✓</span>
      )}
      {!copied && (
        <span className="text-sand/30 text-xs">
          Claims your username · Builds your bundle · Publishes in 60 seconds
        </span>
      )}
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const coolOpacity = useTransform(scrollY, [0, 600], [0, 1]);
  const parallaxY = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <section className="relative h-screen flex items-end justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <img src={heroWarm} alt="A figure standing in a warm beam of light" className="w-full h-full object-cover scale-110" />
      </motion.div>
      <motion.div className="absolute inset-0" style={{ opacity: coolOpacity, y: parallaxY }}>
        <img src={heroCool} alt="" className="w-full h-full object-cover scale-110" />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-dusk/70 via-dusk/30 to-transparent" />

      <div className="relative z-10 text-center pb-16 md:pb-20 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-sand text-4xl md:text-6xl lg:text-[4.5rem] font-display font-light tracking-tight mb-6 leading-[1.08]"
        >
          Your identity file for
          <br />
          the agent internet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
          className="text-sand/55 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          You.md is a structured identity bundle — context, preferences, voice, and goals — that travels with you across every AI interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
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
          <a href="#spec" className="text-sand/40 text-sm hover:text-sand/60 transition-colors duration-200">
            Read the spec →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
