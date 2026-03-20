const SectionLabel = ({ children }: { children: string }) => (
  <h3 className="font-mono text-[10px] sm:text-[11px] text-accent uppercase tracking-wider mb-2 sm:mb-3">&gt; {children}</h3>
);

const Divider = () => <div className="h-px bg-border my-4 sm:my-6" />;

const ProfilePreview = ({ username, mode }: { username: string; mode: "public" | "private" }) => (
  <div className="p-4 sm:p-8 max-w-xl mx-auto">
    {/* Status bar */}
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success status-dot-pulse" />
        <span className="font-mono text-[10px] sm:text-[11px] text-success">ACTIVE</span>
      </div>
      <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/40">
        {mode === "public" ? "public view" : "private view — full context"}
      </span>
    </div>

    {/* ASCII portrait */}
    <div className="terminal-panel mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 text-center overflow-x-auto">
        <pre className="font-mono text-[6px] sm:text-[8px] leading-[1.1] text-accent/60 inline-block text-left">
{`    ░░▒▒▓▓██▓▓▒▒░░    
  ░▒▓██████████████▓▒░  
  ▒███    ████    ███▒  
  ▓██  ●  ████  ●  ██▓  
  ▒███    ████    ███▒  
  ░▒▓██████████████▓▒░  
    ░░▒▒▓▓████▓▓▒▒░░    `}
        </pre>
      </div>
    </div>

    {/* Identity */}
    <div className="mb-1">
      <h1 className="font-mono text-base sm:text-lg text-foreground">@{username}</h1>
      <p className="font-mono text-[12px] sm:text-[13px] text-muted-foreground/70 mt-1">
        Founder, BAMF Media — identity-first growth
      </p>
    </div>

    <Divider />

    {/* Agent Metrics */}
    <SectionLabel>agent metrics</SectionLabel>
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2">
      {[
        { label: "reads", value: "14,203" },
        { label: "freshness", value: "94" },
        { label: "sources", value: "6" },
      ].map((m) => (
        <div key={m.label} className="terminal-panel p-2 sm:p-3">
          <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase">{m.label}</p>
          <p className="font-mono text-base sm:text-lg text-foreground mt-1">{m.value}</p>
        </div>
      ))}
    </div>

    <Divider />

    <SectionLabel>bio</SectionLabel>
    <p className="font-mono text-[11px] sm:text-[12px] text-foreground/70 leading-relaxed">
      Building identity infrastructure for AI agents. Founder at BAMF Media.
      Obsessed with personal branding, growth marketing, and the intersection
      of human identity and machine intelligence.
    </p>

    <Divider />

    <SectionLabel>connected sources</SectionLabel>
    <div className="space-y-2">
      {[
        { name: "LinkedIn", status: "verified" },
        { name: "GitHub", status: "synced" },
        { name: "X / Twitter", status: "synced" },
        { name: "Notion", status: "pending" },
      ].map((s) => (
        <div key={s.name} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
          <span className="text-foreground/70">{s.name}</span>
          <span className={s.status === "verified" ? "text-success" : s.status === "synced" ? "text-accent" : "text-muted-foreground/50"}>
            {s.status === "verified" ? "✓ verified" : s.status === "synced" ? "↻ synced" : "… pending"}
          </span>
        </div>
      ))}
    </div>

    {mode === "private" && (
      <>
        <Divider />
        <SectionLabel>private context</SectionLabel>
        <div className="terminal-panel p-3 sm:p-4">
          <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/50">
            private identity layers visible only to authorized agents and you.
          </p>
          <div className="mt-3 space-y-2 font-mono text-[11px] sm:text-[12px] text-foreground/60">
            <p>• internal project roadmaps</p>
            <p>• investment thesis & preferences</p>
            <p>• communication style training data</p>
            <p>• calendar availability signals</p>
          </div>
        </div>
      </>
    )}

    <Divider />

    <SectionLabel>freshness state</SectionLabel>
    <div className="space-y-1.5">
      {[
        { key: "identity", state: "current" },
        { key: "projects", state: "current" },
        { key: "voice", state: "stale" },
        { key: "sources", state: "syncing" },
      ].map((f) => (
        <div key={f.key} className="flex items-center justify-between font-mono text-[11px] sm:text-[12px]">
          <span className="text-muted-foreground/60">{f.key}</span>
          <span className={f.state === "current" ? "text-success" : f.state === "stale" ? "text-accent" : "text-accent-mid"}>
            {f.state}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfilePreview;
