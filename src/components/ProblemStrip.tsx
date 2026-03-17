import FadeUp from "@/components/FadeUp";

const ProblemStrip = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <FadeUp>
        <p className="text-foreground text-lg md:text-2xl font-display font-light leading-relaxed tracking-tight">
          Every agent you talk to starts from zero.{" "}
          <span className="text-teal">You.md changes that.</span>
        </p>
      </FadeUp>
    </div>
  </section>
);

export default ProblemStrip;
