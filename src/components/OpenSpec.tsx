import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-20 md:py-24 bg-background">
    <div className="max-w-4xl mx-auto px-6">
      <div className="border-t border-b border-border/40 py-12 md:py-16">
        <FadeUp>
          <p className="text-foreground text-center text-lg md:text-xl font-display font-light leading-relaxed max-w-2xl mx-auto">
            <span className="font-mono text-teal text-sm">you-md/v1</span>{" "}
            is an open spec. Read it, fork it, build on it.
          </p>
          <div className="text-center mt-6">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-teal text-sm font-medium hover:underline underline-offset-4 transition-all duration-200"
            >
              View on GitHub →
            </a>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default OpenSpec;
