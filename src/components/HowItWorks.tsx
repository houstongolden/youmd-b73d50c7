import FadeUp from "@/components/FadeUp";

const steps = [
  { number: "01", label: "Run the CLI", description: "npx init youmd — answer a few prompts about yourself." },
  { number: "02", label: "Get your URL", description: "Your bundle publishes to youmd.com/username." },
  { number: "03", label: "Drop it anywhere", description: "Paste your URL into any agent, framework, or tool." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-background/50">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-[0.2em] mb-4">How it works</p>
        <p className="text-foreground/40 text-sm mb-16 max-w-md">Three steps. No signup required.</p>
      </FadeUp>

      <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
        {/* Connector line */}
        <div className="hidden md:block absolute top-[13px] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-border/50" />

        {steps.map((step, i) => (
          <FadeUp key={step.number} delay={i * 0.12}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative z-10 w-[10px] h-[10px] rounded-full bg-teal shadow-[0_0_8px_2px_hsl(var(--teal)/0.3)]" />
                <span className="text-teal/70 font-mono text-[11px] tracking-widest">{step.number}</span>
              </div>
              <h3 className="text-foreground text-lg font-display font-normal mb-2 tracking-tight">{step.label}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
