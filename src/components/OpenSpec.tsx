import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-20 md:py-24 bg-secondary">
    <div className="max-w-4xl mx-auto px-6">
      <div className="py-12 md:py-16">
        <div className="section-divider mb-12" />
        <FadeUp>
          <p className="text-foreground/70 text-center text-lg md:text-xl font-display font-light leading-relaxed max-w-2xl mx-auto">
            <span className="font-mono text-teal/80 text-[13px]">you-md/v1</span>{" "}
            is an open spec. Read it, fork it, build on it.
          </p>
          <div className="text-center mt-6">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-teal/80 text-[13px] font-medium hover:text-teal transition-colors duration-300"
            >
              View on GitHub →
            </a>
          </div>
        </FadeUp>
        <div className="section-divider mt-12" />
      </div>
    </div>
  </section>
);

export default OpenSpec;
