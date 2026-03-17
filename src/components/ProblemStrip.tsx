import { motion } from "framer-motion";
import { useInView } from "framer-motion";
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

const ProblemStrip = () => (
  <section className="bg-sand py-24 md:py-32">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <FadeUp>
        <p className="text-foreground text-xl md:text-2xl font-display font-light leading-relaxed">
          Every agent starts from zero.{" "}
          <span className="text-teal">You.md changes that.</span>
        </p>
      </FadeUp>
    </div>
  </section>
);

export default ProblemStrip;
