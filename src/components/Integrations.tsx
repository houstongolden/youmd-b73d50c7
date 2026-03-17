import FadeUp from "@/components/FadeUp";

const integrations = [
  "Claude Code",
  "Cursor",
  "CrewAI",
  "Goose",
  "Aider",
];

const Integrations = () => (
  <section className="py-20 md:py-28 bg-background border-t border-border/50">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-3">Integrations</p>
        <p className="text-muted-foreground text-sm mb-14">Works where you work.</p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex flex-wrap items-center gap-x-12 md:gap-x-20 gap-y-6">
          {integrations.map((name, i) => (
            <span
              key={name}
              className="text-foreground/30 hover:text-foreground/60 font-display text-xl md:text-2xl font-light tracking-tight transition-colors duration-200 cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

export default Integrations;
