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

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-background">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-12">Pricing</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <FadeUp delay={0}>
          <div className="border border-border rounded-xl p-8">
            <h3 className="text-foreground font-display text-lg font-normal mb-1">Free</h3>
            <p className="text-muted-foreground text-sm mb-6">For getting started</p>
            <p className="text-foreground text-3xl font-display font-light mb-6">$0</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>1 identity file</li>
              <li>Basic preferences</li>
              <li>Manual sharing</li>
            </ul>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.1}>
          <div className="border border-golden rounded-xl p-8">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-display text-lg font-normal">Pro</h3>
              <span className="text-golden text-xs font-mono uppercase tracking-widest">Recommended</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">For power users</p>
            <p className="text-foreground text-3xl font-display font-light mb-6">
              $12<span className="text-muted-foreground text-base font-body">/mo</span>
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Unlimited identity files</li>
              <li>Version history</li>
              <li>Auto-sync with agents</li>
              <li>Priority integrations</li>
            </ul>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default Pricing;
