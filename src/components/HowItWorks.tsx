import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const steps = [
  { number: "01", label: "Run the CLI", cmd: "$ npx create-youmd", description: "Answer a few prompts. Your identity bundle is generated locally." },
  { number: "02", label: "Get your URL", cmd: "$ youmd publish", description: "Your bundle publishes to you.md/username — readable by any agent." },
  { number: "03", label: "Drop it anywhere", cmd: "$ youmd link create", description: "Share your context link with any agent, framework, or tool." },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20 + index * 8, -15]);

  return (
    <motion.div ref={ref} style={{ y }}>
      <FadeUp delay={index * 0.1}>
        <div className="terminal-panel p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green text-[10px] font-mono">●</span>
            <span className="text-mist/40 font-mono text-[10px] tracking-wider">{step.number}</span>
          </div>
          <p className="text-amber/70 font-mono text-[11px] mb-3 bg-panel rounded px-2 py-1 inline-block">{step.cmd}</p>
          <h3 className="text-foreground font-mono text-[14px] font-medium mb-2 tracking-tight">{step.label}</h3>
          <p className="text-mist text-[12px] leading-relaxed">{step.description}</p>
        </div>
      </FadeUp>
    </motion.div>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 overflow-hidden">
    <div className="max-w-3xl mx-auto px-6">
      <FadeUp>
        <p className="text-mist/30 text-[10px] font-mono uppercase tracking-widest mb-2">
          how it works
        </p>
        <p className="text-mist text-[12px] mb-14">Three steps. No signup required.</p>
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
