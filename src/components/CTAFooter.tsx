import heroCool from "@/assets/hero-beam-cool.png";
import FadeUp from "@/components/FadeUp";

const CTAFooter = () => (
  <section id="get-started" className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroCool}
        alt=""
        className="w-full h-full object-cover object-center brightness-[0.3] scale-105"
      />
    </div>

    {/* Top gradient blend */}
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

    <div className="relative z-10 py-32 md:py-44 text-center px-6">
      <FadeUp>
        <p className="text-sand/40 text-xs font-mono uppercase tracking-widest mb-6">Ready?</p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="text-sand text-3xl md:text-5xl lg:text-6xl font-display font-light tracking-tight mb-10">
          Your agents are waiting.
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <a href="#" className="cta-teal inline-block px-8 py-3.5 text-sm">
          Get your You.md
        </a>
      </FadeUp>
    </div>

    {/* Dark footer */}
    <div className="relative z-10 bg-dusk border-t border-sand/10 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sand/30 text-sm font-display tracking-tight">You.md</span>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sand/30 text-xs hover:text-sand/50 transition-colors duration-200">Privacy</a>
          <a href="#" className="text-sand/30 text-xs hover:text-sand/50 transition-colors duration-200">Terms</a>
          <a href="#" className="text-sand/30 text-xs hover:text-sand/50 transition-colors duration-200">GitHub</a>
        </div>
      </div>
    </div>
  </section>
);

export default CTAFooter;
