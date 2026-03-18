import { motion } from "framer-motion";
import FadeUp from "@/components/FadeUp";

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32">
    <div className="max-w-xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/60 font-mono text-[10px] uppercase tracking-widest mb-2">
          ── pricing ──
        </p>
        <p className="text-muted-foreground text-[13px] font-body mb-14">Simple. Fair. Transparent.</p>
      </FadeUp>

      <div className="space-y-6">
        {/* Free */}
        <FadeUp delay={0}>
          <motion.div
            whileHover={{ borderColor: "hsl(var(--accent) / 0.15)" }}
            className="border border-border rounded p-6 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-foreground font-mono text-[13px]">Free</span>
              <span className="text-foreground font-mono text-[20px] font-light">
                $0<span className="text-muted-foreground/60 text-[10px] ml-1">/forever</span>
              </span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-muted-foreground mb-5">
              <p>  ✓ CLI bundle creation</p>
              <p>  ✓ you.md/username publish</p>
              <p>  ✓ Sharing URL</p>
              <p>  ✓ 3 pipeline runs/mo</p>
            </div>
            <a href="#get-started" className="cta-outline block text-center px-4 py-2.5 text-[11px]">
              &gt; youmd init
            </a>
          </motion.div>
        </FadeUp>

        {/* Pro */}
        <FadeUp delay={0.08}>
          <motion.div
            whileHover={{ borderColor: "hsl(var(--accent) / 0.5)" }}
            className="border border-accent/30 rounded p-6 relative overflow-hidden transition-colors"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-foreground font-mono text-[13px]">Pro</span>
              <span className="text-accent font-mono text-[9px] uppercase tracking-wider">recommended</span>
            </div>
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-muted-foreground font-body text-[11px]">For power users.</span>
              <span className="text-foreground font-mono text-[20px] font-light">
                $12<span className="text-muted-foreground/60 text-[10px] ml-1">/mo</span>
              </span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-muted-foreground mb-5">
              <p>  › Unlimited pipeline runs</p>
              <p>  › BYOK — OpenRouter, Perplexity, Apify</p>
              <p>  › Private encrypted vault</p>
              <p>  › Version history</p>
              <p>  › Custom domain</p>
              <p>  › Analytics & scoped API keys</p>
            </div>
            <a href="#get-started" className="cta-primary block text-center px-4 py-2.5 text-[11px]">
              &gt; youmd upgrade --pro
            </a>
            <p className="text-muted-foreground/50 font-mono text-[9px] text-center mt-2">
              keys stored locally, never on our servers
            </p>
          </motion.div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <p className="text-muted-foreground/60 font-mono text-[10px] text-center mt-10">
          we gate on usage intensity — never on core functionality.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default Pricing;
