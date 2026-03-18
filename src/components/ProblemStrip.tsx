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
          <p className="text-muted-foreground/60 font-mono text-[10px] mb-8 tracking-widest uppercase">
            ── the problem ──
          </p>
          <p className="text-foreground/90 font-mono text-[15px] md:text-[17px] font-light leading-[1.8] tracking-tight">
            Every agent you use starts from scratch.{" "}
            <span className="text-accent">Every. Single. Time.</span>
          </p>
          <p className="text-muted-foreground text-[13px] font-body mt-6 leading-relaxed max-w-md mx-auto">
            You re-explain who you are, what you're building, how you like to work.
            Context is lost between sessions, tools, and teams. Your identity doesn't carry.
          </p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="mt-10 flex justify-center gap-6 font-mono text-[10px]">
            {["context lost every session", "re-explain yourself endlessly", "agents that don't know you"].map((item, i) => (
              <motion.span
                key={item}
                className="text-destructive/70 border border-destructive/20 px-3 py-1 rounded"
                whileInView={{ opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                ✗ {item}
              </motion.span>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.25}>
          <p className="text-accent/70 font-mono text-[11px] mt-8">
            one command fixes this →
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
};

export default ProblemStrip;
