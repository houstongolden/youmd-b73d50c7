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
      <motion.div className="max-w-2xl mx-auto px-6 text-center" style={{ y }}>
        <FadeUp>
          <p className="text-muted-foreground/40 text-[10px] mb-6 tracking-widest uppercase">the problem</p>
          <p className="text-foreground/70 text-lg md:text-xl font-mono font-light leading-[1.6] tracking-tight">
            Every agent you talk to starts from{" "}
            <span className="text-accent">zero</span>.
            <br className="hidden md:block" />
            No memory. No context. No you.
          </p>
          <p className="text-accent/60 text-[13px] mt-6 font-mono">
            you.md changes that.
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
};

export default ProblemStrip;
