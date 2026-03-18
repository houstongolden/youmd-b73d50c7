import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-3xl mx-auto px-6">
      <div className="section-divider mb-12" />
      <FadeUp>
        <div className="terminal-panel p-6 md:p-8 text-center">
          <p className="text-amber/60 text-[10px] font-mono mb-4 tracking-wider uppercase">open standard</p>
          <p className="text-foreground/70 text-[14px] md:text-[16px] font-mono font-light leading-relaxed max-w-lg mx-auto">
            <span className="text-cyan">you-md/v1</span> is an open spec.
            <br />
            Read it, fork it, build on it.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-green/70 text-[12px] font-mono hover:text-green transition-colors"
            >
              $ cat spec.you.md →
            </a>
          </div>
        </div>
      </FadeUp>
      <div className="section-divider mt-12" />
    </div>
  </section>
);

export default OpenSpec;
