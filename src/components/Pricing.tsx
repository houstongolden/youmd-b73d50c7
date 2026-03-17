import FadeUp from "@/components/FadeUp";

const Dot = ({ golden = false }: { golden?: boolean }) => (
  <span className={`w-1 h-1 rounded-full ${golden ? "bg-golden/50" : "bg-border"} mt-2 shrink-0`} />
);

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-secondary">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-14">Pricing</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <FadeUp delay={0}>
          <div className="bg-background/60 border border-border/40 rounded-2xl p-8 md:p-10 flex flex-col h-full">
            <h3 className="text-foreground font-display text-lg font-normal mb-1">Free</h3>
            <p className="text-muted-foreground text-sm mb-8">Everything to get started.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">$0</p>
            <ul className="space-y-3.5 text-sm text-muted-foreground mb-10 flex-1">
              <li className="flex items-start gap-3"><Dot />CLI bundle creation</li>
              <li className="flex items-start gap-3"><Dot />youmd.com/username publish</li>
              <li className="flex items-start gap-3"><Dot />Sharing URL</li>
              <li className="flex items-start gap-3"><Dot />3 pipeline runs/mo on platform keys</li>
            </ul>
            <a href="#get-started" className="block text-center border border-border/60 text-foreground font-medium px-6 py-3 rounded-full text-sm hover:border-foreground/30 transition-all duration-200">
              Get started free
            </a>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.1}>
          <div className="bg-background/60 border border-golden/50 rounded-2xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-golden/40" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-display text-lg font-normal">Pro</h3>
              <span className="text-golden text-[10px] font-mono uppercase tracking-widest">Recommended</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">For power users and heavy workflows.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">
              $12<span className="text-muted-foreground text-sm font-body ml-1">/mo</span>
            </p>
            <ul className="space-y-3.5 text-sm text-muted-foreground mb-10 flex-1">
              <li className="flex items-start gap-3"><Dot golden />Unlimited pipeline runs</li>
              <li className="flex items-start gap-3"><Dot golden />BYOK — OpenRouter, Perplexity, Apify, Firecrawl</li>
              <li className="flex items-start gap-3"><Dot golden />Private encrypted vault</li>
              <li className="flex items-start gap-3"><Dot golden />Version history</li>
              <li className="flex items-start gap-3"><Dot golden />Custom domain</li>
              <li className="flex items-start gap-3"><Dot golden />Analytics & scoped API keys</li>
            </ul>
            <a href="#get-started" className="cta-teal block text-center px-6 py-3 text-sm">
              Start Pro
            </a>
            <p className="text-muted-foreground/60 text-[11px] text-center mt-4">Keys stored locally, never on our servers.</p>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.2}>
        <p className="text-muted-foreground text-xs text-center mt-8">
          We gate on usage intensity — never on core functionality.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default Pricing;
