const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const SourcesPane = ({ username }: { username: string }) => {
  const sources = [
    { name: "LinkedIn", status: "verified", lastSync: "2m ago", records: "142 fields", url: "linkedin.com/in/" + username },
    { name: "GitHub", status: "synced", lastSync: "14m ago", records: "87 repos", url: "github.com/" + username },
    { name: "X / Twitter", status: "synced", lastSync: "1h ago", records: "2.4k posts", url: "x.com/" + username },
    { name: "Notion", status: "pending", lastSync: "—", records: "—", url: "—" },
    { name: "Google Calendar", status: "disconnected", lastSync: "—", records: "—", url: "—" },
    { name: "Substack", status: "disconnected", lastSync: "—", records: "—", url: "—" },
  ];

  const statusConfig: Record<string, { icon: string; color: string }> = {
    verified: { icon: "✓", color: "text-success" },
    synced: { icon: "↻", color: "text-accent" },
    pending: { icon: "…", color: "text-accent-mid" },
    disconnected: { icon: "○", color: "text-muted-foreground/40" },
  };

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/40">*/sources</span>
      </div>

      <h2 className="font-mono text-sm sm:text-base text-foreground mb-4 sm:mb-6">connected sources</h2>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: "connected", value: "3" },
          { label: "total records", value: "2,629" },
          { label: "last sync", value: "2m ago" },
        ].map((s) => (
          <div key={s.label} className="terminal-panel p-2 sm:p-3 text-center">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase">{s.label}</p>
            <p className="font-mono text-sm sm:text-base text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <SectionLabel>all sources</SectionLabel>
      <div className="space-y-2">
        {sources.map((s) => {
          const cfg = statusConfig[s.status] || statusConfig.disconnected;
          return (
            <div key={s.name} className="terminal-panel p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[11px] sm:text-[12px] ${cfg.color}`}>{cfg.icon}</span>
                  <span className="font-mono text-[12px] sm:text-[13px] text-foreground/80">{s.name}</span>
                </div>
                <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-wider ${cfg.color}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
                <span>last sync: {s.lastSync}</span>
                <span>records: {s.records}</span>
              </div>
              {s.url !== "—" && (
                <div className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/30 mt-1 truncate">{s.url}</div>
              )}
            </div>
          );
        })}
      </div>

      <Divider />

      <SectionLabel>add source</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4">
        <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">
          connect a new source via terminal:
        </p>
        <div className="mt-2 font-mono text-[11px] sm:text-[12px] text-accent bg-background rounded px-2 sm:px-3 py-2 overflow-x-auto">
          &gt; add source https://linkedin.com/in/you
        </div>
      </div>

      <Divider />

      <SectionLabel>sync schedule</SectionLabel>
      <div className="terminal-panel p-3 sm:p-4 space-y-2">
        {[
          { label: "auto-sync", value: "enabled" },
          { label: "frequency", value: "every 30 min" },
          { label: "next sync", value: "in 28 min" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
            <span className="text-muted-foreground/60">{r.label}</span>
            <span className="text-foreground/70">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesPane;
