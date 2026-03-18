import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const ProblemStrip = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="py-24 md:py-32 overflow-hidden">
      <motion.div className="max-w-xl mx-auto px-6 text-center" style={{ y }}>
        <FadeUp>
          <p className="text-muted-foreground/30 text-[10px] mb-8 tracking-widest uppercase">
            ── the problem ──
          </p>
          <p className="text-foreground/80 text-[15px] md:text-[17px] font-mono font-light leading-[1.8] tracking-tight">
            The agent internet doesn't know who you are.{" "}
            <span className="text-accent">Yet.</span>
          </p>
          <p className="text-muted-foreground text-[12px] mt-6 leading-relaxed max-w-md mx-auto">
            Every agent starts from zero. No memory. No context. No you.
            You re-explain yourself every time.
          </p>
          <p className="text-accent/50 text-[11px] mt-8 font-mono">
            one command changes that →
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
};

export default ProblemStrip;
