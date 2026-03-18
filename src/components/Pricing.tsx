import FadeUp from "@/components/FadeUp";

const Dot = ({ golden = false }: { golden?: boolean }) => (
  <span className={`w-1 h-1 rounded-full ${golden ? "bg-accent/60" : "bg-teal/35"} mt-[7px] shrink-0`} />
);

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-secondary">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.25em] mb-3">Pricing</p>
        <p className="text-foreground/35 text-sm mb-14">Simple, fair, transparent.</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Free */}
        <FadeUp delay={0}>
          <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col h-full">
            <h3 className="text-foreground font-display text-lg font-normal mb-1 tracking-tight">Free</h3>
            <p className="text-muted-foreground text-[13px] mb-6">Everything to get started.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8 tracking-tight">$0</p>
            <ul className="space-y-3 text-[13px] text-muted-foreground mb-10 flex-1">
              <li className="flex items-start gap-3"><Dot />CLI bundle creation</li>
              <li className="flex items-start gap-3"><Dot />youmd.com/username publish</li>
              <li className="flex items-start gap-3"><Dot />Sharing URL</li>
              <li className="flex items-start gap-3"><Dot />3 pipeline runs/mo on platform keys</li>
            </ul>
            <a
              href="#get-started"
              className="block text-center border border-border/60 text-foreground/70 font-medium px-6 py-2.5 rounded-full text-[13px] hover:border-foreground/20 hover:text-foreground transition-all duration-300"
            >
              Get started free
            </a>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.08}>
          <div
            className="glass-card rounded-2xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden"
            style={{
              borderColor: "hsl(var(--golden) / 0.35)",
              boxShadow: "0 0 32px -10px hsl(var(--golden) / 0.12)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-display text-lg font-normal tracking-tight">Pro</h3>
              <span className="text-accent text-[9px] font-mono uppercase tracking-[0.15em]">Recommended</span>
            </div>
            <p className="text-muted-foreground text-[13px] mb-6">For power users and heavy workflows.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8 tracking-tight">
              $12<span className="text-muted-foreground text-[13px] font-body ml-1">/mo</span>
            </p>
            <ul className="space-y-3 text-[13px] text-muted-foreground mb-10 flex-1">
              <li className="flex items-start gap-3"><Dot golden />Unlimited pipeline runs</li>
              <li className="flex items-start gap-3"><Dot golden />BYOK — OpenRouter, Perplexity, Apify, Firecrawl</li>
              <li className="flex items-start gap-3"><Dot golden />Private encrypted vault</li>
              <li className="flex items-start gap-3"><Dot golden />Version history</li>
              <li className="flex items-start gap-3"><Dot golden />Custom domain</li>
              <li className="flex items-start gap-3"><Dot golden />Analytics & scoped API keys</li>
            </ul>
            <a href="#get-started" className="cta-teal block text-center px-6 py-2.5 text-[13px]">
              Start Pro
            </a>
            <p className="text-muted-foreground/40 text-[10px] text-center mt-4">Keys stored locally, never on our servers.</p>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <p className="text-muted-foreground/50 text-[11px] text-center mt-10">
          We gate on usage intensity — never on core functionality.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default Pricing;
