import FadeUp from "@/components/FadeUp";

const agents = ["Claude Code", "Cursor", "CrewAI", "Goose", "Aider", "OpenClaw", "Codex CLI"];

const Integrations = () => (
  <section className="py-16 md:py-24">
    <div className="max-w-xl mx-auto px-6">
      <FadeUp>
        <p className="text-muted-foreground/30 font-mono text-[10px] uppercase tracking-widest mb-10 text-center">
          ── compatible agents ──
        </p>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {agents.map((name) => (
            <span
              key={name}
              className="text-muted-foreground/40 hover:text-accent font-mono text-[11px] transition-colors duration-300 cursor-default select-none px-2.5 py-1"
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
