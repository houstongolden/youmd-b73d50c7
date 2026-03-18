import FadeUp from "@/components/FadeUp";

const ProblemStrip = () => (
  <section className="bg-background py-24 md:py-32">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <FadeUp>
        <p className="text-foreground text-xl md:text-3xl font-display font-light leading-relaxed tracking-tight">
          Every agent you talk to starts from zero.
          <br className="hidden md:block" />
          <span className="text-teal"> You.md changes that.</span>
        </p>
      </FadeUp>
    </div>
  </section>
);

export default ProblemStrip;
