import FadeUp from "@/components/FadeUp";

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-background">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-3">Pricing</p>
        <p className="text-muted-foreground text-sm mb-14">Simple, transparent. No feature overload.</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <FadeUp delay={0}>
          <div className="border border-border rounded-xl p-8 md:p-10 flex flex-col h-full">
            <h3 className="text-foreground font-display text-lg font-normal mb-1">Free</h3>
            <p className="text-muted-foreground text-sm mb-8">For getting started</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">$0</p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-border" />
                1 identity file
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-border" />
                Basic preferences
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-border" />
                Manual sharing
              </li>
            </ul>
            <a href="#get-started" className="block text-center border border-border text-foreground font-medium px-6 py-3 rounded-lg text-sm hover:border-foreground/30 transition-all duration-200">
              Get started free
            </a>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.1}>
          <div className="border border-golden/60 rounded-xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden">
            {/* Subtle golden accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-golden/40" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-display text-lg font-normal">Pro</h3>
              <span className="text-golden text-[10px] font-mono uppercase tracking-widest">Recommended</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">For power users</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">
              $12<span className="text-muted-foreground text-sm font-body ml-1">/mo</span>
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-golden/60" />
                Unlimited identity files
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-golden/60" />
                Version history
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-golden/60" />
                Auto-sync with agents
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-golden/60" />
                Priority integrations
              </li>
            </ul>
            <a href="#get-started" className="cta-teal block text-center px-6 py-3 text-sm">
              Get your You.md
            </a>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default Pricing;
