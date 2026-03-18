import { useState } from "react";
import { Copy, Check } from "lucide-react";
import heroWarm from "@/assets/hero-beam.png";
import FadeUp from "@/components/FadeUp";

const CTAFooter = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx init youmd");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {/* CTA section */}
      <section id="get-started" className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-15">
          <img src={heroWarm} alt="" className="w-full h-full object-cover object-[center_25%]" />
        </div>
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 py-32 md:py-40 text-center px-6">
          <FadeUp>
            <h2 className="text-foreground text-3xl md:text-5xl lg:text-[3.5rem] font-display font-light tracking-tight mb-10 leading-[1.1]">
              Your agents are waiting.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <button onClick={handleCopy} className="cli-pill cli-glow inline-flex items-center gap-3 px-7 py-4 mb-3">
              <span className="text-foreground/40">$</span>
              <span className="text-foreground font-medium">npx init youmd</span>
              <span className="cursor-blink text-teal">▌</span>
              <span className="ml-2 text-foreground/40">
                {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
              </span>
            </button>
            {copied && <p className="text-teal text-xs font-mono mt-1">Copied ✓</p>}
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/25 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-foreground font-display text-sm tracking-tight">You.md</span>
          <div className="flex items-center gap-8">
            <a href="#spec" className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200">Spec</a>
            <a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200">GitHub</a>
            <a href="#pricing" className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200">Pricing</a>
            <a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200">Docs</a>
          </div>
          <span className="text-muted-foreground/50 text-[11px]">you-md/v1 open spec · Built by BAMF Media</span>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
