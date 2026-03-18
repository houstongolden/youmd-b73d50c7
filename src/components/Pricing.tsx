import FadeUp from "@/components/FadeUp";

const Check = () => <span className="text-success text-[10px]">✓</span>;
const Dot = () => <span className="text-accent text-[10px]">›</span>;

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32">
    <div className="max-w-3xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/40 text-[10px] font-mono uppercase tracking-widest mb-2">pricing</p>
        <p className="text-muted-foreground text-[12px] mb-14">Simple. Fair. Transparent.</p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Free */}
        <FadeUp delay={0}>
          <div className="terminal-panel p-6 md:p-8 flex flex-col h-full">
            <div className="terminal-panel-header -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 px-4 rounded-t">
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <span className="ml-2 text-muted-foreground/40 text-[10px] font-mono">free.plan</span>
            </div>
            <h3 className="text-foreground font-mono text-[14px] font-medium mb-1">Free</h3>
            <p className="text-muted-foreground text-[11px] mb-5">Everything to get started.</p>
            <p className="text-foreground text-3xl font-mono font-light mb-6">
              $0<span className="text-muted-foreground/40 text-[11px] ml-1">/forever</span>
            </p>
            <ul className="space-y-2.5 text-[11px] text-muted-foreground mb-8 flex-1">
              <li className="flex items-start gap-2.5"><Check />CLI bundle creation</li>
              <li className="flex items-start gap-2.5"><Check />you.md/username publish</li>
              <li className="flex items-start gap-2.5"><Check />Sharing URL</li>
              <li className="flex items-start gap-2.5"><Check />3 pipeline runs/mo</li>
            </ul>
            <a
              href="#get-started"
              className="cta-outline block text-center px-6 py-2.5 text-[11px]"
            >
              &gt; youmd init
            </a>
          </div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.08}>
          <div
            className="terminal-panel p-6 md:p-8 flex flex-col h-full"
            style={{ borderColor: "hsl(var(--accent) / 0.3)" }}
          >
            <div className="terminal-panel-header -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 px-4 rounded-t">
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <span className="ml-2 text-accent/50 text-[10px] font-mono">pro.plan</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground font-mono text-[14px] font-medium">Pro</h3>
              <span className="text-accent text-[9px] font-mono uppercase tracking-wider">recommended</span>
            </div>
            <p className="text-muted-foreground text-[11px] mb-5">For power users and heavy workflows.</p>
            <p className="text-foreground text-3xl font-mono font-light mb-6">
              $12<span className="text-muted-foreground/40 text-[11px] ml-1">/mo</span>
            </p>
            <ul className="space-y-2.5 text-[11px] text-muted-foreground mb-8 flex-1">
              <li className="flex items-start gap-2.5"><Dot />Unlimited pipeline runs</li>
              <li className="flex items-start gap-2.5"><Dot />BYOK — OpenRouter, Perplexity, Apify</li>
              <li className="flex items-start gap-2.5"><Dot />Private encrypted vault</li>
              <li className="flex items-start gap-2.5"><Dot />Version history</li>
              <li className="flex items-start gap-2.5"><Dot />Custom domain</li>
              <li className="flex items-start gap-2.5"><Dot />Analytics & scoped API keys</li>
            </ul>
            <a href="#get-started" className="cta-primary block text-center px-6 py-2.5 text-[11px]">
              &gt; youmd upgrade --pro
            </a>
            <p className="text-muted-foreground/30 text-[9px] text-center mt-3 font-mono">keys stored locally, never on our servers</p>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <p className="text-muted-foreground/40 text-[10px] text-center mt-10 font-mono">
          we gate on usage intensity — never on core functionality.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default Pricing;
