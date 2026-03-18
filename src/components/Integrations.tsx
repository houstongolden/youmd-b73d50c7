import FadeUp from "@/components/FadeUp";

const integrations = ["Claude Code", "Cursor", "CrewAI", "Goose", "Aider"];

const Integrations = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.25em] mb-14 text-center">
          Works where agents work
        </p>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-16 gap-y-5">
          {integrations.map((name) => (
            <span
              key={name}
              className="text-foreground/18 hover:text-foreground/40 font-display text-lg md:text-xl font-light tracking-tight transition-colors duration-400 cursor-default select-none"
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
