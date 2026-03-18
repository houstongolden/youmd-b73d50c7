import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const ProblemStrip = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  return (
    <section ref={ref} className="bg-background py-28 md:py-36 overflow-hidden">
      <motion.div className="max-w-3xl mx-auto px-6 text-center" style={{ y, scale }}>
        <FadeUp>
          <p className="text-foreground/70 text-xl md:text-[1.75rem] font-display font-light leading-[1.5] tracking-tight">
            Every agent you talk to starts from zero.
            <br className="hidden md:block" />
            <span className="text-teal"> You.md changes that.</span>
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
};

export default ProblemStrip;
