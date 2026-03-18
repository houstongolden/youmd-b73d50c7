import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const steps = [
  { number: "01", label: "Run the CLI", description: "npx init youmd — answer a few prompts about yourself." },
  { number: "02", label: "Get your URL", description: "Your bundle publishes to youmd.com/username." },
  { number: "03", label: "Drop it anywhere", description: "Paste your URL into any agent, framework, or tool." },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30 + index * 10, -20]);

  return (
    <motion.div ref={ref} style={{ y }}>
      <FadeUp delay={index * 0.1}>
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-teal/70 shadow-[0_0_10px_3px_hsl(var(--teal)/0.2)]" />
            <span className="text-teal/50 font-mono text-[10px] tracking-[0.15em]">{step.number}</span>
          </div>
          <h3 className="text-foreground text-lg font-display font-normal mb-2 tracking-tight">{step.label}</h3>
          <p className="text-muted-foreground text-[13px] leading-relaxed">{step.description}</p>
        </div>
      </FadeUp>
    </motion.div>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-background overflow-hidden">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.25em] mb-3">How it works</p>
        <p className="text-foreground/35 text-sm mb-16 max-w-sm">Three steps. No signup required.</p>
      </FadeUp>

      <div className="relative grid md:grid-cols-3 gap-12 md:gap-10">
        <div className="hidden md:block absolute top-[13px] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-gradient-to-r from-teal/20 via-teal/10 to-teal/20" />
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
