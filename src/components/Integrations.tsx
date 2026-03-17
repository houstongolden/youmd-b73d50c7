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

const integrations = [
  "Claude Code",
  "Cursor",
  "CrewAI",
  "Goose",
  "Aider",
];

const Integrations = () => (
  <section className="py-24 md:py-32 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4">Integrations</p>
        <p className="text-muted-foreground text-sm mt-2 mb-12">Works where you work.</p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex flex-wrap items-center gap-8 md:gap-14">
          {integrations.map((name) => (
            <span
              key={name}
              className="text-foreground/40 font-display text-lg md:text-xl font-light tracking-tight"
            >
              {name}
            </span>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

export default Integrations;
