import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-xl mx-auto px-6">
      <div className="section-divider mb-12" />
      <FadeUp>
        <div className="text-center py-8">
          <p className="text-muted-foreground/30 text-[10px] font-mono mb-6 tracking-wider uppercase">
            ── open standard ──
          </p>
          <p className="text-foreground/70 text-[14px] font-mono font-light leading-relaxed">
            <span className="text-accent">you-md/v1</span> is an open spec.
          </p>
          <p className="text-muted-foreground text-[12px] mt-2">
            Read it, fork it, build on it.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="text-muted-foreground/40 text-[11px] font-mono hover:text-accent transition-colors"
            >
              &gt; cat spec.you.md →
            </a>
          </div>
        </div>
      </FadeUp>
      <div className="section-divider mt-12" />
    </div>
  </section>
);

export default OpenSpec;
