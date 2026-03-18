import FadeUp from "@/components/FadeUp";

const Dot = ({ golden = false }: { golden?: boolean }) => (
  <span className={`w-1.5 h-1.5 rounded-full ${golden ? "bg-golden/60" : "bg-teal/40"} mt-[7px] shrink-0`} />
);

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-secondary">
    <div className="max-w-4xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-[0.2em] mb-4">Pricing</p>
        <p className="text-foreground/40 text-sm mb-14">Simple, fair, transparent.</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <FadeUp delay={0}>
          <div
            className="rounded-2xl p-8 md:p-10 flex flex-col h-full"
            style={{
              background: "hsl(0 0% 100% / 0.3)",
              border: "1px solid hsl(0 0% 100% / 0.45)",
            }}
          >
            <h3 className="text-foreground font-display text-lg font-normal mb-1">Free</h3>
            <p className="text-muted-foreground text-sm mb-6">Everything to get started.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">$0</p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
              <li className="flex items-start gap-3"><Dot />CLI bundle creation</li>
              <li className="flex items-start gap-3"><Dot />youmd.com/username publish</li>
              <li className="flex items-start gap-3"><Dot />Sharing URL</li>
              <li className="flex items-start gap-3"><Dot />3 pipeline runs/mo on platform keys</li>
            </ul>
            <a href="#get-started" className="block text-center border border-foreground/15 text-foreground font-medium px-6 py-3 rounded-full text-sm hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-200">
              Get started free
            </a>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.1}>
          <div
            className="rounded-2xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden"
            style={{
              background: "hsl(0 0% 100% / 0.35)",
              border: "1.5px solid hsl(var(--golden) / 0.45)",
              boxShadow: "0 0 24px -8px hsl(var(--golden) / 0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-display text-lg font-normal">Pro</h3>
              <span className="text-golden text-[10px] font-mono uppercase tracking-widest">Recommended</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">For power users and heavy workflows.</p>
            <p className="text-foreground text-4xl font-display font-light mb-8">
              $12<span className="text-muted-foreground text-sm font-body ml-1">/mo</span>
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
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
            <p className="text-muted-foreground/50 text-[11px] text-center mt-4">Keys stored locally, never on our servers.</p>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.2}>
        <p className="text-muted-foreground/60 text-xs text-center mt-10">
          We gate on usage intensity — never on core functionality.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default Pricing;
