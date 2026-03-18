import { motion } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-xl mx-auto px-6">
      <div className="section-divider mb-12" />
      <FadeUp>
        <div className="text-center py-8">
          <p className="text-muted-foreground/30 font-mono text-[10px] mb-6 tracking-wider uppercase">
            ── open standard ──
          </p>
          <p className="text-foreground/70 font-mono text-[14px] font-light leading-relaxed">
            <motion.span
              className="text-accent inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              you-md/v1
            </motion.span>{" "}
            is an open spec.
          </p>
          <p className="text-muted-foreground font-body text-[13px] mt-2">
            Read it, fork it, build on it.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <a
              href="#"
              className="text-muted-foreground/40 font-mono text-[11px] hover:text-accent transition-colors duration-200"
            >
              &gt; cat spec.you.md →
            </a>
            <a
              href="#"
              className="text-muted-foreground/40 font-mono text-[11px] hover:text-accent transition-colors duration-200"
            >
              &gt; github →
            </a>
          </div>
        </div>
      </FadeUp>
      <div className="section-divider mt-12" />
    </div>
  </section>
);

export default OpenSpec;
