import FadeUp from "@/components/FadeUp";

const OpenSpec = () => (
  <section className="py-16 md:py-20 bg-background">
    <div className="max-w-4xl mx-auto px-6">
      <div className="border-t border-b border-border/50 py-10 md:py-14">
        <FadeUp>
          <p className="text-foreground text-center text-base md:text-lg font-display font-light leading-relaxed max-w-2xl mx-auto">
            <span className="font-mono text-teal text-sm">you-md/v1</span> is an open spec.{" "}
            Anyone can read, implement, or extend it.
          </p>
          <div className="text-center mt-5">
            <a
              href="#"
              className="text-teal text-sm hover:underline underline-offset-4 transition-all duration-200"
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
