import FadeUp from "@/components/FadeUp";

const integrations = ["Claude Code", "Cursor", "CrewAI", "Goose", "Aider"];

const Integrations = () => (
  <section className="py-20 md:py-28 bg-background/50">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-[0.2em] mb-16 text-center">
          Works where agents work
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-20 gap-y-6">
          {integrations.map((name) => (
            <span
              key={name}
              className="text-foreground/20 hover:text-foreground/45 font-display text-xl md:text-2xl font-light tracking-tight transition-colors duration-300 cursor-default select-none"
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
