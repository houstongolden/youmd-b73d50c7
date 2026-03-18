import FadeUp from "@/components/FadeUp";
import AsciiAvatar from "@/components/AsciiAvatar";
import houstonImg from "@/assets/houston-portrait.jpeg";

const FounderQuote = () => (
  <section className="relative py-20 px-4">
    <FadeUp>
      <div className="max-w-3xl mx-auto">
        {/* Quote block */}
        <div className="terminal-panel p-8 md:p-12">
          <div className="terminal-panel-header -mx-8 -mt-8 md:-mx-12 md:-mt-12 mb-8">
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <span className="font-mono text-[10px] text-muted-foreground/40 ml-2">founder.log</span>
          </div>

          <div className="font-mono text-[10px] text-muted-foreground/40 mb-4">
            $ cat /why/youmd.txt
          </div>

          <blockquote className="font-mono text-sm md:text-base leading-relaxed text-foreground/85 space-y-4">
            <p>
              <span className="text-accent">&gt;</span>{" "}
              Every new agent started from zero — no idea who I am, what I'm building, or how I work. I kept re-explaining myself.
            </p>
            <p>
              <span className="text-accent">&gt;</span>{" "}
              So I built an identity context protocol. One shareable link gives any agent your full context — skills, preferences, projects — no blank slate. Turns out everyone had this problem. So I open-sourced it as{" "}
              <span className="text-accent font-medium">you.md</span>.
            </p>
          </blockquote>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded overflow-hidden border border-border">
                <AsciiAvatar src={houstonImg} cols={40} canvasWidth={40} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-mono text-xs text-foreground/80">Houston Golden</div>
                <div className="font-mono text-[10px] text-muted-foreground/50">founder · you.md</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
    <div className="absolute bottom-0 inset-x-0 section-divider" />
  </section>
);

export default FounderQuote;
