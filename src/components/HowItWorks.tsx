import FadeUp from "@/components/FadeUp";

const steps = [
  { number: "01", label: "Build", description: "Answer a few questions to shape your identity file." },
  { number: "02", label: "Publish", description: "Your You.md is stored, versioned, and ready to share." },
  { number: "03", label: "Share", description: "Drop it into any AI tool. Instant context, every time." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-16">How it works</p>
      </FadeUp>

      <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-border" />

        {steps.map((step, i) => (
          <FadeUp key={step.number} delay={i * 0.12}>
            <div className="relative">
              {/* Step dot */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative z-10 w-4 h-4 rounded-full border-2 border-teal bg-background" />
                <span className="text-teal font-mono text-xs tracking-wider">{step.number}</span>
              </div>
              <h3 className="text-foreground text-xl font-display font-normal mb-2 tracking-tight">{step.label}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
