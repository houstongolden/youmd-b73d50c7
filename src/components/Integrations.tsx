import FadeUp from "@/components/FadeUp";

const integrations = ["Claude Code", "Cursor", "CrewAI", "Goose", "Aider"];

const Integrations = () => (
  <section className="py-16 md:py-24">
    <div className="max-w-3xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/40 text-[10px] font-mono uppercase tracking-widest mb-12 text-center">
          compatible agents
        </p>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 gap-y-3">
          {integrations.map((name) => (
            <span
              key={name}
              className="text-muted-foreground/40 hover:text-accent font-mono text-[12px] md:text-[13px] transition-colors duration-300 cursor-default select-none px-3 py-1.5 rounded border border-transparent hover:border-accent/20"
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
