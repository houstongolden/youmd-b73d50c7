import heroCool from "@/assets/hero-beam-cool.png";
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

const CTAFooter = () => (
  <section id="get-started" className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroCool}
        alt=""
        className="w-full h-full object-cover object-top brightness-[0.35]"
      />
    </div>

    <div className="relative z-10 py-32 md:py-40 text-center px-6">
      <FadeUp>
        <h2 className="text-sand text-3xl md:text-5xl font-display font-light tracking-tight mb-4">
          Your agents are waiting.
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="mt-8">
          <a
            href="#"
            className="bg-teal text-dusk font-medium px-7 py-3 rounded-lg text-sm hover:brightness-110 transition-all duration-200 inline-block"
          >
            Get your You.md
          </a>
        </div>
      </FadeUp>
    </div>

    <div className="relative z-10 bg-dusk py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sand/40 text-sm font-display">You.md</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sand/40 text-xs hover:text-sand/60 transition-colors duration-200">Privacy</a>
          <a href="#" className="text-sand/40 text-xs hover:text-sand/60 transition-colors duration-200">Terms</a>
          <a href="#" className="text-sand/40 text-xs hover:text-sand/60 transition-colors duration-200">GitHub</a>
        </div>
      </div>
    </div>
  </section>
);

export default CTAFooter;
