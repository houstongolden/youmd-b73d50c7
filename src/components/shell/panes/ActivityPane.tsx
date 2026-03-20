const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const ActivityPane = ({ username }: { username: string }) => {
  const activities = [
    { time: "2m ago", action: "agent_read", detail: "Claude (Anthropic) read public context", icon: "◇" },
    { time: "14m ago", action: "agent_read", detail: "GPT-4 (OpenAI) read public context", icon: "◇" },
    { time: "1h ago", action: "sync", detail: "LinkedIn source auto-synced", icon: "↻" },
    { time: "2h ago", action: "agent_read", detail: "Gemini (Google) read public bio", icon: "◇" },
    { time: "3h ago", action: "updated", detail: "Agent updated projects section", icon: "△" },
    { time: "5h ago", action: "agent_read", detail: "Perplexity read full identity context", icon: "◇" },
    { time: "8h ago", action: "sync", detail: "GitHub source auto-synced", icon: "↻" },
    { time: "12h ago", action: "connected", detail: "Notion source connected", icon: "⊕" },
    { time: "1d ago", action: "published", detail: `Profile published to you.md/${username}`, icon: "↑" },
    { time: "1d ago", action: "initialized", detail: "Identity context initialized", icon: "●" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/activity</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">activity log</h2>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: "reads today", value: "847" },
          { label: "syncs today", value: "3" },
          { label: "updates", value: "1" },
        ].map((s) => (
          <div key={s.label} className="terminal-panel p-2 sm:p-3 text-center">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase">{s.label}</p>
            <p className="font-mono text-sm sm:text-base text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <SectionLabel>recent activity</SectionLabel>
      <div className="space-y-0">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3 py-2 sm:py-2.5 border-b border-border/30 last:border-0">
            <span className="font-mono text-[11px] sm:text-[12px] text-accent/60 mt-0.5 w-4 text-center shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] sm:text-[12px] text-foreground/70">{a.detail}</p>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/40 shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPane;
