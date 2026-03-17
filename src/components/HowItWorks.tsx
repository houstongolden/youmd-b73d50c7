import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

const steps = [
  { number: "01", label: "Build", description: "Answer a few questions to shape your identity file." },
  { number: "02", label: "Publish", description: "Your You.md is stored, versioned, and ready to share." },
  { number: "03", label: "Share", description: "Drop it into any AI tool. Instant context, every time." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4">How it works</p>
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-16 mt-12">
        {steps.map((step, i) => (
          <FadeUp key={step.number} delay={i * 0.1}>
            <div>
              <span className="text-teal font-mono text-sm">{step.number}</span>
              <div className="w-8 h-px bg-border mt-3 mb-4" />
              <h3 className="text-foreground text-lg font-display font-normal mb-2">{step.label}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
