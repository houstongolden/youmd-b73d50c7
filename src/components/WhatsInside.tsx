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

const codeLines = [
  { key: "name", value: '"Alex Chen"' },
  { key: "role", value: '"Product designer & founder"' },
  { key: "tone", value: '"Direct, warm, no jargon"' },
  { key: "context", value: '"Building a dev tool startup, Series A"' },
  { key: "preferences", value: "" },
  { key: "  format", value: '"Bullet points over paragraphs"' },
  { key: "  length", value: '"Concise — never more than 3 paragraphs"' },
  { key: "goals", value: "" },
  { key: "  current", value: '"Ship v2 by March, close funding round"' },
];

const WhatsInside = () => (
  <section id="spec" className="py-24 md:py-32 bg-mauve/20">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4">What's inside</p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-dusk rounded-xl p-6 md:p-10 mt-8 overflow-x-auto">
          <pre className="font-mono text-sm leading-loose">
            <code>
              {codeLines.map((line, i) => (
                <div key={i}>
                  <span className="text-sand/40">{line.key}</span>
                  {line.value ? (
                    <>
                      <span className="text-sand/30">: </span>
                      <span className="text-teal">{line.value}</span>
                    </>
                  ) : (
                    <span className="text-sand/30">:</span>
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </FadeUp>
    </div>
  </section>
);

export default WhatsInside;
