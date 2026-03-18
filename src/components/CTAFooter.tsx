import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import FadeUp from "@/components/FadeUp";

const CTAFooter = () => {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx youmd init");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <section ref={sectionRef} id="get-started" className="relative overflow-hidden py-32 md:py-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[400px] beam-glow pointer-events-none" />

        <motion.div className="relative z-10 text-center px-6" style={{ y: contentY }}>
          <FadeUp>
            <h2 className="text-foreground text-2xl md:text-4xl font-mono font-light tracking-tight mb-10 leading-[1.2]">
              Your agents are waiting.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <button onClick={handleCopy} className="cli-pill inline-flex items-center gap-3 px-5 py-3 mb-3">
              <span className="text-muted-foreground">$</span>
              <span className="text-accent font-medium">npx youmd init</span>
              <span className="cursor-blink text-accent">█</span>
              <span className="ml-2 text-muted-foreground/30">
                {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              </span>
            </button>
            {copied && <p className="text-success text-[11px] mt-1">copied to clipboard</p>}
          </FadeUp>
        </motion.div>
      </section>

      <footer className="py-8 px-6">
        <div className="section-divider mb-8" />
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-accent font-mono text-[12px]">
            you.md
          </span>
          <div className="flex items-center gap-6">
            <a href="#spec" className="text-muted-foreground/40 text-[10px] font-mono hover:text-accent transition-colors">&gt; spec</a>
            <a href="#" className="text-muted-foreground/40 text-[10px] font-mono hover:text-accent transition-colors">&gt; github</a>
            <a href="#pricing" className="text-muted-foreground/40 text-[10px] font-mono hover:text-accent transition-colors">&gt; pricing</a>
            <a href="#" className="text-muted-foreground/40 text-[10px] font-mono hover:text-accent transition-colors">&gt; docs</a>
            <Link to="/profiles" className="text-muted-foreground/40 text-[10px] font-mono hover:text-accent transition-colors">&gt; profiles</Link>
          </div>
          <span className="text-muted-foreground/25 text-[9px] font-mono">you-md/v1 · BAMF Media</span>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
