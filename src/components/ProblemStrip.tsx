import FadeUp from "@/components/FadeUp";

const ProblemStrip = () => (
  <section className="bg-background py-28 md:py-36">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <FadeUp>
        <p className="text-foreground/70 text-xl md:text-[1.75rem] font-display font-light leading-[1.5] tracking-tight">
          Every agent you talk to starts from zero.
          <br className="hidden md:block" />
          <span className="text-teal"> You.md changes that.</span>
        </p>
      </FadeUp>
    </div>
  </section>
);

export default ProblemStrip;
